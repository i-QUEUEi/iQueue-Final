import { useEffect, useMemo, useState } from 'react';
import {
  fetchDatasetSummary,
  fetchHistoricalAnalytics,
  fetchPredictiveAnalytics,
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
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
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

export function useTodayAtAGlance() {
  const [historicalAnalytics, setHistoricalAnalytics] = useState<HistoricalAnalyticsResponse | null>(null);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<PredictiveAnalyticsResponse | null>(null);
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
    const history = loadDailyAnalyticsHistory();
    const todaySnapshot = history.find((entry) => entry.date === todayKey);

    async function loadAnalyticsSupport() {
      if (todaySnapshot) {
        setHistoricalAnalytics(todaySnapshot.historicalAnalytics);
        setPredictiveAnalytics(todaySnapshot.predictiveAnalytics);
      }

      try {
        const [datasetResponse, historicalResponse, predictiveResponse] = await Promise.all([
          fetchDatasetSummary(),
          fetchHistoricalAnalytics(),
          fetchPredictiveAnalytics(),
        ]);

        if (!cancelled) {
          setHistoricalAnalytics(historicalResponse);
          setPredictiveAnalytics(predictiveResponse);

          addOrReplaceSnapshot({
            date: todayKey,
            createdAt: new Date().toISOString(),
            datasetSummary: datasetResponse,
            historicalAnalytics: historicalResponse,
            predictiveAnalytics: predictiveResponse,
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
  const averageWait = dailyLiveData?.averageWait ?? getAverageHistoricalWait(historicalAnalytics, defaultAverageWait);
  const currentCongestion = dailyLiveData?.currentCongestion ?? predictiveAnalytics?.predictions?.afternoon?.congestion ?? 'Moderate';

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
