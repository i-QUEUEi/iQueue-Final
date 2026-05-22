import type { VisitorFeedback, VisitorRequest } from './visitor-storage';
import type { PredictiveAnalyticsResponse } from './api';

export const DAILY_LIVE_DATA_HISTORY_KEY = 'dailyLiveDataHistory';
const BASELINE_CURRENT_VISITORS = 113;

export type DailyLiveDataRecord = {
  date: string;
  createdAt: string;
  updatedAt: string;
  totalVisitors: number;
  confirmedVisits: number;
  pendingVisits: number;
  feedbackCount: number;
  branchActivity: number;
  averageWait: number;
  currentCongestion: string;
  queuePredictionSummary: string;
};

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseWaitMinutes(waitTime: string | undefined, fallback: number) {
  if (!waitTime) return fallback;
  const match = waitTime.match(/\d+(?:\.\d+)?/);
  if (!match) return fallback;
  return Math.round(Number(match[0]));
}

function getCurrentPrediction(predictions: PredictiveAnalyticsResponse['predictions'] | undefined) {
  if (!predictions) return null;

  const hours = new Date().getHours();
  const slotKey = hours < 12 ? 'morning' : hours < 17 ? 'afternoon' : 'evening';
  const slotData = predictions[slotKey] ?? Object.values(predictions)[0];
  return slotData ?? null;
}

const LIGHT_CONGESTION_MAX = 12;
const MODERATE_CONGESTION_MAX = 30;

function deriveCongestionFromConfirmed(confirmedVisits: number) {
  if (confirmedVisits === 0) {
    return 'Light';
  }

  if (confirmedVisits <= LIGHT_CONGESTION_MAX) {
    return 'Light';
  }

  if (confirmedVisits <= MODERATE_CONGESTION_MAX) {
    return 'Moderate';
  }

  return 'High';
}

function loadPersisted(): DailyLiveDataRecord[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(DAILY_LIVE_DATA_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePersisted(items: DailyLiveDataRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DAILY_LIVE_DATA_HISTORY_KEY, JSON.stringify(items));
}

function buildBaseDailyLiveData(
  requests: VisitorRequest[],
  feedback: VisitorFeedback[],
  predictiveAnalytics: PredictiveAnalyticsResponse | null
): DailyLiveDataRecord {
  const todayKey = getTodayKey();
  const todayRequests = requests.filter((request) => request.createdAt.startsWith(todayKey));
  const todayFeedback = feedback.filter((entry) => entry.submittedAt.startsWith(todayKey));

  const confirmedVisits = todayRequests.filter((request) => request.status === 'confirmed').length;
  const pendingVisits = todayRequests.filter((request) => request.status === 'pending').length;
  const branchActivity = new Set(todayRequests.map((request) => request.branchId)).size;
  const currentPrediction = getCurrentPrediction(predictiveAnalytics?.predictions);
  const currentCongestion = deriveCongestionFromConfirmed(confirmedVisits);
  const averageWait = currentPrediction
    ? parseWaitMinutes(currentPrediction.waitTime, 18)
    : 18;

  const queueSummary = currentPrediction
    ? `${currentPrediction.waitTime} expected • ${currentCongestion}`
    : 'No current prediction available';

  return {
    date: todayKey,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalVisitors: BASELINE_CURRENT_VISITORS + todayRequests.length,
    confirmedVisits,
    pendingVisits,
    feedbackCount: todayFeedback.length,
    branchActivity,
    averageWait,
    currentCongestion,
    queuePredictionSummary: queueSummary,
  };
}

export function loadDailyLiveDataHistory(): DailyLiveDataRecord[] {
  return loadPersisted();
}

export function loadTodayLiveData(): DailyLiveDataRecord | null {
  const history = loadPersisted();
  const todayKey = getTodayKey();
  return history.find((entry) => entry.date === todayKey) ?? null;
}

export function saveDailyLiveData(record: DailyLiveDataRecord) {
  const history = loadPersisted();
  const next = history.filter((entry) => entry.date !== record.date);
  next.push(record);
  savePersisted(next);
}

export function buildDailyLiveData(
  requests: VisitorRequest[],
  feedback: VisitorFeedback[],
  predictiveAnalytics: PredictiveAnalyticsResponse | null,
  existingRecord?: DailyLiveDataRecord | null
): DailyLiveDataRecord {
  const updated = buildBaseDailyLiveData(requests, feedback, predictiveAnalytics);
  return {
    ...updated,
    createdAt: existingRecord?.createdAt ?? updated.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

export function computeAndSaveTodayLiveData(
  requests: VisitorRequest[],
  feedback: VisitorFeedback[],
  predictiveAnalytics: PredictiveAnalyticsResponse | null
): DailyLiveDataRecord {
  const existing = loadTodayLiveData();
  const record = buildDailyLiveData(requests, feedback, predictiveAnalytics, existing);
  saveDailyLiveData(record);
  return record;
}
