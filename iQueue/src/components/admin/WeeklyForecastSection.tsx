import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchWeeklyForecast, type WeeklyForecastResponse } from '@/lib/api';

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
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
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
