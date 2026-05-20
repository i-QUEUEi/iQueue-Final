const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
const API_BASE_URL = configuredBaseUrl.endsWith('/api') ? configuredBaseUrl : `${configuredBaseUrl}/api`;
const SERVICE_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

export type WeeklyForecastDay = {
  date: string;
  dayName: string;
  shortDate: string;
  isHoliday: boolean;
  overall: number | null;
  congestion: string;
  bestTime: string | null;
  bestWait: number | null;
  bestP10?: number | null;
  bestP90?: number | null;
  worstTime: string | null;
  worstWait: number | null;
  hourly: Array<{ hour: string; wait: number; p10: number; p90: number }>;
};

export type WeeklyForecastResponse = {
  weekLabel: string;
  weekOf: string;
  days: WeeklyForecastDay[];
};

export type HealthResponse = {
  status: string;
  model_loaded?: boolean;
  data_loaded?: boolean;
  records_loaded?: number;
  model_path?: string;
  data_path?: string;
};

export type InfoResponse = {
  service: string;
  version?: string;
  description?: string;
};

export type ModelPerformanceResponse = {
  performanceMetrics: Array<{
    model: string;
    mae: number;
    maeUnit: string;
    accuracy: string;
    status: string;
    color: string;
  }>;
  comparisonData: Array<{
    model: string;
    mae: string;
    rmse: string;
    r2: string;
  }>;
  chartData?: Array<{
    hour: string;
    randomForest?: number;
    gradientBoosting?: number;
    actual?: number;
  }>;
};

export type HistoricalAnalyticsResponse = {
  insights: Array<{
    title: string;
    desc: string;
    value: string;
  }>;
  dailyData: Array<{
    day: string;
    avgWait: number;
    trend?: string;
    busiest?: boolean;
  }>;
  hourlyData?: Array<{
    hour: string;
    wait: number;
  }>;
  heatmapData?: Array<{
    day: string;
    morning: number;
    afternoon: number;
    evening: number;
  }>;
};

export type PredictiveAnalyticsResponse = {
  predictions: Record<string, {
    waitTime: string;
    confidence: number;
    congestion: string;
    recommendation: string;
    color: string;
  }>;
  timeSlots?: Array<{
    id: string;
    label: string;
    time: string;
  }>;
  systemReliability?: {
    operational: number;
    slow: number;
    down: number;
  };
};

export type DatasetSummaryResponse = {
  totalRecords: number;
  dateRange: {
    start: string;
    end: string;
  };
  averageWaitTime: number;
  medianWaitTime: number;
  maxWaitTime: number;
  peakHour: number;
  busiestDay: number;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
  branchId?: string | null;
  priority: 'Advisory' | 'Maintenance' | 'Alert' | 'Other';
  attachmentName?: string | null;
  attachmentUrl?: string | null;
};

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path.startsWith('/api/')
    ? `${SERVICE_BASE_URL}${path}`
    : `${SERVICE_BASE_URL}${path}`, init);

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function fetchHealth() {
  return fetchJson<HealthResponse>('/health');
}

export function fetchInfo() {
  return fetchJson<InfoResponse>('/info');
}

export function fetchModelPerformance() {
  return fetchJson<ModelPerformanceResponse>('/api/model-performance');
}

export function fetchHistoricalAnalytics() {
  return fetchJson<HistoricalAnalyticsResponse>('/api/historical-analytics');
}

export function fetchPredictiveAnalytics() {
  return fetchJson<PredictiveAnalyticsResponse>('/api/predictive-analytics');
}

export function fetchDatasetSummary() {
  return fetchJson<DatasetSummaryResponse>('/api/dataset-summary');
}

export function fetchWeeklyForecast(date: string) {
  return fetchJson<WeeklyForecastResponse>(`/api/weekly-forecast?date=${encodeURIComponent(date)}`);
}

export function fetchAnnouncements() {
  return fetchJson<{ announcements: Announcement[] }>('/api/announcements');
}

export function createAnnouncement(payload: Omit<Announcement, 'id'> & { id?: string }) {
  return fetchJson<Announcement>('/api/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function updateAnnouncement(id: string, payload: Omit<Announcement, 'id'>) {
  return fetchJson<Announcement>(`/api/announcements/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function deleteAnnouncement(id: string) {
  return fetchJson<{ deleted: boolean; id: string }>(`/api/announcements/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
