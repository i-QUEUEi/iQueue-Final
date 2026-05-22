import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { fetchWeeklyForecast, type WeeklyForecastDay, type WeeklyForecastResponse } from '@/lib/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const weeklyForecastCache = new Map<string, WeeklyForecastResponse>();
const weeklyForecastRequests = new Map<string, Promise<WeeklyForecastResponse>>();
let cachedSelectedMonday: Date | null = null;
let cachedCalendarMonth: number | null = null;
let cachedCalendarYear: number | null = null;

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toYmd(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function congestionStyles(congestion: string) {
  switch (congestion) {
    case 'HIGH':
      return {
        accent: 'bg-red-500',
        badge: 'bg-red-100 text-red-700',
        surface: 'border-red-200 bg-red-50',
      };
    case 'MODERATE':
      return {
        accent: 'bg-amber-500',
        badge: 'bg-amber-100 text-amber-700',
        surface: 'border-amber-200 bg-amber-50',
      };
    case 'CLOSED':
      return {
        accent: 'bg-slate-400',
        badge: 'bg-slate-200 text-slate-700',
        surface: 'border-slate-200 bg-slate-50',
      };
    default:
      return {
        accent: 'bg-emerald-500',
        badge: 'bg-emerald-100 text-emerald-700',
        surface: 'border-emerald-200 bg-emerald-50',
      };
  }
}

function buildDailyAiInsight(day: WeeklyForecastDay) {
  if (day.isHoliday) {
    return 'AI Insight: Treat this as a closed-service day and redirect appointments to the nearest available service date.';
  }

  if (!day.bestTime || !day.worstTime || day.bestWait === null || day.worstWait === null) {
    return 'AI Insight: Forecast detail is limited for this day, so keep staffing flexible until more hourly data is available.';
  }

  const bestWait = Math.round(day.bestWait);
  const worstWait = Math.round(day.worstWait);
  const gap = Math.max(0, worstWait - bestWait);
  const sortedHours = [...day.hourly].sort((a, b) => b.wait - a.wait);
  const peakHour = sortedHours[0]?.hour ?? day.worstTime;
  const nextPeakHour = sortedHours[1]?.hour;

  switch (day.congestion) {
    case 'HIGH':
      return `AI Insight: Shift flexible visits toward ${day.bestTime}; protect staffing around ${peakHour}${nextPeakHour ? ` and ${nextPeakHour}` : ''} when waits can climb by ${gap} min.`;
    case 'MODERATE':
      return `AI Insight: Keep a normal team ready, then add queue support near ${day.worstTime}; ${day.bestTime} is the best slot for lower-priority visits.`;
    case 'LOW':
      return `AI Insight: Demand looks manageable, so use ${day.bestTime} for quick transactions and monitor ${day.worstTime} for a short queue build-up.`;
    case 'CLOSED':
      return 'AI Insight: No active service forecast is available for this day.';
    default:
      return `AI Insight: Use ${day.bestTime} as the recommended slot and watch ${day.worstTime}, where the model expects the longest wait.`;
  }
}

function buildWeeklyForecastInsight(forecast: WeeklyForecastResponse) {
  const validDays = forecast.days.filter((day) => !day.isHoliday && typeof day.overall === 'number');
  if (!validDays.length) {
    return {
      summary: 'Weekly forecast detail is unavailable. Review the service schedule or wait for additional model output.',
      analysis: 'No reliable operational summary can be generated until forecast data becomes available for this week.',
    };
  }

  const highDays = validDays.filter((day) => day.congestion === 'HIGH');
  const moderateDays = validDays.filter((day) => day.congestion === 'MODERATE');
  const lowDays = validDays.filter((day) => day.congestion === 'LOW');

  const sortedByWait = [...validDays].sort((a, b) => (a.overall ?? 0) - (b.overall ?? 0));
  const bestDay = sortedByWait[0];
  const worstDay = sortedByWait[sortedByWait.length - 1];

  const averageWait = Math.round(validDays.reduce((sum, day) => sum + (day.overall ?? 0), 0) / validDays.length);
  const firstDay = validDays[0];
  const lastDay = validDays[validDays.length - 1];
  const trend = typeof lastDay.overall === 'number' && typeof firstDay.overall === 'number'
    ? lastDay.overall > firstDay.overall + 8
      ? 'rises into the back half of the week'
      : lastDay.overall < firstDay.overall - 8
        ? 'eases toward the end of the week'
        : 'stays relatively stable across the week'
    : 'follows a steady pattern across the week';

  const peakDaysLabel = highDays.length
    ? highDays.map((day) => day.dayName).join(' and ')
    : moderateDays.length
      ? moderateDays.map((day) => day.dayName).join(' and ')
      : validDays.map((day) => day.dayName).join(' and ');

  const highRiskText = highDays.length
    ? `Expect the heaviest queue pressure on ${peakDaysLabel}, with ${worstDay.worstTime ? `peak wait periods around ${worstDay.worstTime}` : 'extended wait windows'}.`
    : `No days are forecasted as very high congestion, so focus on maintaining steady throughput.`;

  const bestDayText = bestDay
    ? `${bestDay.dayName} offers the most balanced experience, especially near ${bestDay.bestTime} when waits are lowest.`
    : 'No clear best day is available from the forecast.';

  return {
    summary: `The week is expected to average about ${averageWait} minutes of wait time, with ${peakDaysLabel} driving the highest intensity. ${trend}.`,
    analysis: `${highRiskText} ${bestDayText} ${lowDays.length ? `Lower congestion appears on ${lowDays.map((day) => day.dayName).join(' and ')}, making those days ideal for faster transactions.` : ''}`.trim(),
  };
}

export default function WeeklyForecastSection() {
  const today = useMemo(() => {
    const current = new Date();
    current.setHours(0, 0, 0, 0);
    return current;
  }, []);

  const initialMonday = cachedSelectedMonday ? new Date(cachedSelectedMonday) : getMondayOfWeek(today);
  const initialMonth = cachedCalendarMonth ?? initialMonday.getMonth();
  const initialYear = cachedCalendarYear ?? initialMonday.getFullYear();
  const initialForecast = weeklyForecastCache.get(toYmd(initialMonday)) ?? null;

  const [calendarMonth, setCalendarMonth] = useState(initialMonth);
  const [calendarYear, setCalendarYear] = useState(initialYear);
  const [selectedMonday, setSelectedMonday] = useState<Date>(initialMonday);
  const [forecast, setForecast] = useState<WeeklyForecastResponse | null>(initialForecast);
  const [loading, setLoading] = useState(!initialForecast);
  const [error, setError] = useState<string | null>(null);
  const weeklyInsight = useMemo(() => (forecast ? buildWeeklyForecastInsight(forecast) : null), [forecast]);

  useEffect(() => {
    let cancelled = false;

    async function loadForecast() {
      const weekKey = toYmd(selectedMonday);
      cachedSelectedMonday = new Date(selectedMonday);
      cachedCalendarMonth = calendarMonth;
      cachedCalendarYear = calendarYear;
      setError(null);

      const cachedForecast = weeklyForecastCache.get(weekKey);
      if (cachedForecast) {
        setForecast(cachedForecast);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const pendingRequest = weeklyForecastRequests.get(weekKey) ?? fetchWeeklyForecast(weekKey);
        weeklyForecastRequests.set(weekKey, pendingRequest);

        const nextForecast = await pendingRequest;
        weeklyForecastCache.set(weekKey, nextForecast);
        weeklyForecastRequests.delete(weekKey);

        if (!cancelled) {
          setForecast(nextForecast);
        }
      } catch (err) {
        weeklyForecastRequests.delete(weekKey);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load weekly forecast.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadForecast();

    return () => {
      cancelled = true;
    };
  }, [selectedMonday]);

  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
  const startOffset = firstDay.getDay();
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;
  const cells: Array<Date | null> = [];

  for (let i = 0; i < totalCells; i += 1) {
    const dayNum = i - startOffset + 1;
    cells.push(dayNum < 1 || dayNum > lastDay.getDate() ? null : new Date(calendarYear, calendarMonth, dayNum));
  }

  const isSameWeek = (day: Date | null) => {
    if (!day) return false;
    return toYmd(getMondayOfWeek(day)) === toYmd(selectedMonday);
  };

  const handleDayClick = (day: Date | null) => {
    if (!day) return;

    const monday = getMondayOfWeek(day);
    setSelectedMonday(monday);
    cachedSelectedMonday = new Date(monday);

    if (monday.getMonth() !== calendarMonth || monday.getFullYear() !== calendarYear) {
      setCalendarMonth(monday.getMonth());
      setCalendarYear(monday.getFullYear());
      cachedCalendarMonth = monday.getMonth();
      cachedCalendarYear = monday.getFullYear();
    }
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(calendarYear, calendarMonth + delta, 1);
    setCalendarMonth(next.getMonth());
    setCalendarYear(next.getFullYear());
    cachedCalendarMonth = next.getMonth();
    cachedCalendarYear = next.getFullYear();
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <div className="flex flex-col gap-2 mb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weekly Forecast</h3>
          <p className="text-sm text-gray-600">
            Forecasted Monday to Saturday waits from the deployed ML service.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {forecast?.weekLabel ?? 'Loading current week'}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-700 transition hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-center">
              <p className="font-semibold text-gray-900">{MONTHS[calendarMonth]} {calendarYear}</p>
              <button
                type="button"
                onClick={() => {
                  const monday = getMondayOfWeek(today);
                  setSelectedMonday(monday);
                  setCalendarMonth(today.getMonth());
                  setCalendarYear(today.getFullYear());
                  cachedSelectedMonday = new Date(monday);
                  cachedCalendarMonth = today.getMonth();
                  cachedCalendarYear = today.getFullYear();
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Jump to current week
              </button>
            </div>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-700 transition hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, index) => {
              const isToday = day && toYmd(day) === toYmd(today);
              const active = isSameWeek(day);

              return (
                <button
                  key={`${day ? toYmd(day) : 'empty'}-${index}`}
                  type="button"
                  disabled={!day}
                  onClick={() => handleDayClick(day)}
                  className={[
                    'h-10 rounded-lg text-sm font-medium transition',
                    !day ? 'invisible' : '',
                    active ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-blue-50',
                  ].join(' ')}
                >
                  {day?.getDate()}
                  {isToday ? <span className="sr-only">Today</span> : null}
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Selected Week</p>
            <p className="mt-1 text-sm font-medium text-blue-900">{forecast?.weekLabel ?? 'Waiting for forecast data'}</p>
          </div>

          {weeklyInsight ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex-1 flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Overall AI Insight</p>
              </div>
              <div className="space-y-4 text-sm text-gray-700 flex-1">
                <div className="min-h-[90px]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Weekly Summary</p>
                  <p className="mt-2 leading-relaxed">{weeklyInsight.summary}</p>
                </div>
                <div className="min-h-[90px]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Forecast Analysis</p>
                  <p className="mt-2 leading-relaxed">{weeklyInsight.analysis}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-600">
              Loading weekly forecast...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {forecast?.days.map((day) => {
                  const styles = congestionStyles(day.congestion);

                  return (
                    <article key={day.date} className={`rounded-2xl border p-4 ${styles.surface}`}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{day.dayName}</h4>
                          <p className="text-xs text-gray-600">{day.shortDate}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}>
                          {day.congestion}
                        </span>
                      </div>

                      {day.isHoliday ? (
                        <p className="text-sm font-medium text-gray-600">Holiday. No service forecast.</p>
                      ) : (
                        <>
                          <div className="flex items-end gap-2 mb-3">
                            <span className="text-3xl font-bold text-gray-900">{Math.round(day.overall ?? 0)}</span>
                            <span className="pb-1 text-sm text-gray-600">min avg wait</span>
                          </div>
                          <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex items-center justify-between">
                              <span>Best slot</span>
                              <span className="font-semibold text-emerald-700">
                                {day.bestTime ? `${day.bestTime} (${day.bestWait} min)` : 'No data'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Avoid</span>
                              <span className="font-semibold text-red-700">
                                {day.worstTime ? `${day.worstTime} (${day.worstWait} min)` : 'No data'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 rounded-xl border border-white/70 bg-white/70 p-3 shadow-sm">
                            <div className="mb-1 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-blue-600" />
                              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">AI Insight</p>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-700">{buildDailyAiInsight(day)}</p>
                          </div>
                          {day.hourly.length > 0 ? (
                            <div className="mt-4">
                              <div className="mb-2 flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${styles.accent}`} />
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Hourly Outlook</p>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                {day.hourly.slice(0, 6).map((hour) => (
                                  <div key={hour.hour} className="rounded-lg bg-white/80 px-2 py-2 text-center">
                                    <p className="text-xs text-gray-500">{hour.hour}</p>
                                    <p className="text-sm font-semibold text-gray-900">{Math.round(hour.wait)}m</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </>
                      )}
                    </article>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500">
                Forecasts come from `/api/weekly-forecast` on the deployed backend and summarize the Monte Carlo output per service hour.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
