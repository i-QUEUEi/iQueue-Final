import { useEffect, useMemo, useState } from 'react';
import {
  fetchDatasetSummary,
  fetchHistoricalAnalytics,
  fetchPredictiveAnalytics,
  fetchWeeklyForecast,
  type DatasetSummaryResponse,
  type HistoricalAnalyticsResponse,
  type PredictiveAnalyticsResponse,
} from './api';
import {
  loadVisitorFeedback,
  loadVisitorRequests,
  subscribeToVisitorStorageChanges,
  type VisitorFeedback,
  type VisitorRequest,
} from './visitor-storage';
import {
  computeAndSaveTodayLiveData,
  loadTodayLiveData,
  type DailyLiveDataRecord,
} from './daily-live-data';

const DAILY_ANALYTICS_HISTORY_KEY = 'dailyAnalyticsHistory';

interface DailyAnalyticsSnapshot {
  date: string;
  createdAt: string;
  datasetSummary: DatasetSummaryResponse | null;
  historicalAnalytics: HistoricalAnalyticsResponse | null;
  predictiveAnalytics: PredictiveAnalyticsResponse | null;
  forecastCongestion: string | null;
  forecastAverageWait: number | null;
}

function getTodayKey() {
  return getLocalDateKey(new Date());
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMondayOfWeek(date: Date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  next.setHours(0, 0, 0, 0);
  return next;
}

function loadDailyAnalyticsHistory(): DailyAnalyticsSnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DAILY_ANALYTICS_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDailyAnalyticsHistory(history: DailyAnalyticsSnapshot[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DAILY_ANALYTICS_HISTORY_KEY, JSON.stringify(history));
}

function addOrReplaceSnapshot(snapshot: DailyAnalyticsSnapshot) {
  const history = loadDailyAnalyticsHistory();
  const next = history.filter((entry) => entry.date !== snapshot.date);
  next.push(snapshot);
  saveDailyAnalyticsHistory(next);
}

function getAverageHistoricalWait(historical: HistoricalAnalyticsResponse | null, fallback: number) {
  const values = historical?.dailyData?.map((item) => item.avgWait) ?? [];
  if (!values.length) return fallback;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function formatCongestionLabel(value: string | null | undefined) {
  if (!value) return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

function getForecastDayKey(value: string) {
  const normalized = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized;
  }

  const parsed = new Date(normalized);
  if (!Number.isNaN(parsed.getTime())) {
    return getLocalDateKey(parsed);
  }

  return null;
}

function getTodayForecastCongestion(
  todayKey: string,
  forecastDays: Array<{ date: string; congestion: string }> | undefined
) {
  const todayForecast = forecastDays?.find((day) => getForecastDayKey(day.date) === todayKey);
  return formatCongestionLabel(todayForecast?.congestion);
}

function getTodayForecastAverageWait(
  todayKey: string,
  forecastDays: Array<{ date: string; overall: number | null }> | undefined
) {
  const todayForecast = forecastDays?.find((day) => getForecastDayKey(day.date) === todayKey);
  if (typeof todayForecast?.overall !== 'number') {
    return null;
  }

  return Math.round(todayForecast.overall);
}

export function useTodayAtAGlance() {
  const [historicalAnalytics, setHistoricalAnalytics] = useState<HistoricalAnalyticsResponse | null>(null);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<PredictiveAnalyticsResponse | null>(null);
  const [forecastCongestion, setForecastCongestion] = useState<string | null>(null);
  const [forecastAverageWait, setForecastAverageWait] = useState<number | null>(null);
  const [visitorRequests, setVisitorRequests] = useState<VisitorRequest[]>([]);
  const [visitorFeedback, setVisitorFeedback] = useState<VisitorFeedback[]>([]);
  const [dailyLiveData, setDailyLiveData] = useState<DailyLiveDataRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayDate, setTodayDate] = useState(getTodayKey());

  useEffect(() => {
    const refreshLocalData = () => {
      setVisitorRequests(loadVisitorRequests());
      setVisitorFeedback(loadVisitorFeedback());
    };

    refreshLocalData();
    return subscribeToVisitorStorageChanges(refreshLocalData);
  }, []);

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const delay = nextMidnight.getTime() - now.getTime();
    const timer = window.setTimeout(() => setTodayDate(getTodayKey()), delay);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const todayLive = loadTodayLiveData();
    const initialLiveData = todayLive ?? computeAndSaveTodayLiveData(loadVisitorRequests(), loadVisitorFeedback(), null);
    setDailyLiveData(initialLiveData);
    setLoading(false);
  }, [todayDate]);

  useEffect(() => {
    let cancelled = false;
    const todayKey = getTodayKey();
    const todayLocalKey = getLocalDateKey(new Date());
    const mondayKey = getLocalDateKey(getMondayOfWeek(new Date()));
    const history = loadDailyAnalyticsHistory();
    const todaySnapshot = history.find((entry) => entry.date === todayKey);

    async function loadAnalyticsSupport() {
      if (todaySnapshot) {
        setHistoricalAnalytics(todaySnapshot.historicalAnalytics);
        setPredictiveAnalytics(todaySnapshot.predictiveAnalytics);
        setForecastCongestion(todaySnapshot.forecastCongestion);
        setForecastAverageWait(todaySnapshot.forecastAverageWait);
      }

      try {
        const [datasetResponse, historicalResponse, predictiveResponse, weeklyForecastResponse] = await Promise.all([
          fetchDatasetSummary(),
          fetchHistoricalAnalytics(),
          fetchPredictiveAnalytics(),
          fetchWeeklyForecast(mondayKey),
        ]);

        const nextForecastCongestion = getTodayForecastCongestion(todayLocalKey, weeklyForecastResponse.days);
        const nextForecastAverageWait = getTodayForecastAverageWait(todayLocalKey, weeklyForecastResponse.days);

        if (!cancelled) {
          setHistoricalAnalytics(historicalResponse);
          setPredictiveAnalytics(predictiveResponse);
          setForecastCongestion(nextForecastCongestion);
          setForecastAverageWait(nextForecastAverageWait);

          addOrReplaceSnapshot({
            date: todayKey,
            createdAt: new Date().toISOString(),
            datasetSummary: datasetResponse,
            historicalAnalytics: historicalResponse,
            predictiveAnalytics: predictiveResponse,
            forecastCongestion: nextForecastCongestion,
            forecastAverageWait: nextForecastAverageWait,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load analytics support data.');
        }
      }
    }

    loadAnalyticsSupport();

    return () => {
      cancelled = true;
    };
  }, [todayDate]);

  useEffect(() => {
    const liveData = computeAndSaveTodayLiveData(visitorRequests, visitorFeedback, predictiveAnalytics);
    setDailyLiveData(liveData);
  }, [visitorRequests, visitorFeedback, predictiveAnalytics, todayDate]);

  const confirmedVisits = useMemo(() => {
    return visitorRequests.filter((request) => request.status === 'confirmed' && request.createdAt.startsWith(todayDate)).length;
  }, [visitorRequests, todayDate]);

  const defaultAverageWait = 18;
  const averageWait = forecastAverageWait
    ?? dailyLiveData?.averageWait
    ?? getAverageHistoricalWait(historicalAnalytics, defaultAverageWait);
  const currentCongestion = forecastCongestion
    ?? formatCongestionLabel(dailyLiveData?.currentCongestion)
    ?? formatCongestionLabel(predictiveAnalytics?.predictions?.afternoon?.congestion)
    ?? 'Moderate';

  return {
    loading,
    error,
    totalVisitors: dailyLiveData?.totalVisitors ?? 0,
    avgWait: averageWait,
    currentCongestion,
    confirmedVisits,
    feedbackCount: dailyLiveData?.feedbackCount ?? 0,
    dailyLiveData,
  };
}
