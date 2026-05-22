import {
  fetchDatasetSummary,
  fetchHistoricalAnalytics,
  fetchPredictiveAnalytics,
  fetchWeeklyForecast,
  type DatasetSummaryResponse,
  type HistoricalAnalyticsResponse,
  type PredictiveAnalyticsResponse,
  type WeeklyForecastResponse,
} from './api';
import { loadPersistedBranches } from './branches';
import { loadVisitorRequests } from './visitor-storage';
import { loadTodayLiveData } from './daily-live-data';

function escapeCsvField(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function formatCsv(rows: Array<Array<string | number | boolean | null | undefined>>): string {
  return rows.map((row) => row.map(escapeCsvField).join(',')).join('\r\n');
}

function saveCsvFile(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function fetchWithFallback<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher();
  } catch {
    return fallback;
  }
}

export async function exportAnalyticsCsv() {
  const [datasetSummary, historicalAnalytics, predictiveAnalytics] = await Promise.all([
    fetchWithFallback(fetchDatasetSummary, null as DatasetSummaryResponse | null),
    fetchWithFallback(fetchHistoricalAnalytics, null as HistoricalAnalyticsResponse | null),
    fetchWithFallback(fetchPredictiveAnalytics, null as PredictiveAnalyticsResponse | null),
  ]);

  const todayLiveData = loadTodayLiveData();
  const rows: Array<Array<string | number | boolean | null | undefined>> = [];

  rows.push(['Analytics Export']);
  rows.push([]);
  rows.push(['Live dashboard metrics']);
  rows.push(['Metric', 'Value']);
  rows.push(['Total visitors (today)', todayLiveData?.totalVisitors ?? 'N/A']);
  rows.push(['Confirmed visits (today)', todayLiveData?.confirmedVisits ?? 'N/A']);
  rows.push(['Pending visits (today)', todayLiveData?.pendingVisits ?? 'N/A']);
  rows.push(['Feedback count (today)', todayLiveData?.feedbackCount ?? 'N/A']);
  rows.push(['Average wait (today)', todayLiveData?.averageWait ?? 'N/A']);
  rows.push(['Current congestion', todayLiveData?.currentCongestion ?? 'N/A']);
  rows.push(['Queue prediction summary', todayLiveData?.queuePredictionSummary ?? 'N/A']);
  rows.push([]);

  if (datasetSummary) {
    rows.push(['Dataset summary']);
    rows.push(['Metric', 'Value']);
    rows.push(['Total records', datasetSummary.totalRecords]);
    rows.push(['Date range start', datasetSummary.dateRange.start]);
    rows.push(['Date range end', datasetSummary.dateRange.end]);
    rows.push(['Average wait time', datasetSummary.averageWaitTime]);
    rows.push(['Median wait time', datasetSummary.medianWaitTime]);
    rows.push(['Max wait time', datasetSummary.maxWaitTime]);
    rows.push(['Peak hour', datasetSummary.peakHour]);
    rows.push(['Busiest day of month', datasetSummary.busiestDay]);
    rows.push([]);
  }

  if (historicalAnalytics?.dailyData?.length) {
    rows.push(['Historical daily analytics']);
    rows.push(['Day', 'Avg wait (min)', 'Trend', 'Busiest']);
    historicalAnalytics.dailyData.forEach((item) => {
      rows.push([item.day, item.avgWait, item.trend ?? '', item.busiest ? 'yes' : 'no']);
    });
    rows.push([]);
  }

  if (predictiveAnalytics?.predictions) {
    rows.push(['Predictive analytics']);
    rows.push(['Slot', 'Wait time', 'Congestion', 'Recommendation', 'Confidence']);
    Object.entries(predictiveAnalytics.predictions).forEach(([slot, row]) => {
      rows.push([slot, row.waitTime, row.congestion, row.recommendation, row.confidence]);
    });
    if (predictiveAnalytics.systemReliability) {
      rows.push([]);
      rows.push(['System reliability']);
      rows.push(['Operational %', predictiveAnalytics.systemReliability.operational]);
      rows.push(['Slow %', predictiveAnalytics.systemReliability.slow]);
      rows.push(['Down %', predictiveAnalytics.systemReliability.down]);
    }
  }

  saveCsvFile('analytics.csv', formatCsv(rows));
}

export async function exportForecastCsv() {
  const today = new Date().toISOString().slice(0, 10);
  const forecast = await fetchWithFallback(fetchWeeklyForecast.bind(null, today), null as WeeklyForecastResponse | null);
  const rows: Array<Array<string | number | boolean | null | undefined>> = [];

  if (forecast) {
    rows.push(['Forecast Export']);
    rows.push(['Week label', forecast.weekLabel]);
    rows.push(['Week of', forecast.weekOf]);
    rows.push([]);
    rows.push(['Day', 'Date', 'Overall', 'Congestion', 'Best time', 'Best wait', 'Worst time', 'Worst wait']);
    forecast.days.forEach((day) => {
      rows.push([
        day.dayName,
        day.shortDate,
        day.overall ?? 'N/A',
        day.congestion,
        day.bestTime ?? '',
        day.bestWait ?? '',
        day.worstTime ?? '',
        day.worstWait ?? '',
      ]);
    });
  } else {
    rows.push(['Forecast Export']);
    rows.push(['Error', 'Forecast service unavailable.']);
  }

  saveCsvFile('forecast.csv', formatCsv(rows));
}

export function exportVisitsCsv() {
  const requests = loadVisitorRequests();
  const rows: Array<Array<string | number | boolean | null | undefined>> = [];

  rows.push(['Visits Export']);
  rows.push(['Request ID', 'Name', 'Office', 'Branch ID', 'Branch Name', 'Service', 'Visit Date', 'Visit Time', 'Status', 'Created At']);
  requests.forEach((request) => {
    rows.push([
      request.id,
      request.name,
      request.office,
      request.branchId,
      request.branchName,
      request.service,
      request.visitDate,
      request.visitTime,
      request.status,
      request.createdAt,
    ]);
  });

  saveCsvFile('visits.csv', formatCsv(rows));
}

export function exportReportsCsv() {
  const rows: Array<Array<string | number | boolean | null | undefined>> = [];
  const reports = [
    { category: 'Wait time', status: 'Acknowledged', time: '2:45 PM', message: 'Queue at Window 3 is about 45 minutes.', helpful: 23 },
    { category: 'Queue', status: 'Under review', time: '2:30 PM', message: 'Lobby overflow into the hallway near restrooms.', helpful: 18 },
    { category: 'System', status: 'Resolved', time: '2:15 PM', message: 'Kiosk 4 hanging on barcode scan step.', helpful: 12 },
    { category: 'Wait time', status: 'Acknowledged', time: '1:50 PM', message: 'License Registration window taking longer than usual.', helpful: 19 },
    { category: 'Queue', status: 'Under review', time: '1:30 PM', message: 'Missing signage for License Plate Issuance.', helpful: 8 },
    { category: 'System', status: 'Resolved', time: '1:15 PM', message: 'Number display board not updating.', helpful: 15 },
    { category: 'Wait time', status: 'Acknowledged', time: '12:45 PM', message: 'Expected 20 min wait, now 35 minutes.', helpful: 31 },
    { category: 'Queue', status: 'Forwarded', time: '12:20 PM', message: 'Temperature is too high in main lobby.', helpful: 7 },
  ];

  rows.push(['Reports Export']);
  rows.push(['Category', 'Status', 'Time', 'Message', 'Helpful votes']);
  reports.forEach((report) => {
    rows.push([report.category, report.status, report.time, report.message, report.helpful]);
  });

  saveCsvFile('reports.csv', formatCsv(rows));
}

export function exportBranchesCsv() {
  const branches = loadPersistedBranches();
  const requests = loadVisitorRequests();

  const counts = requests.reduce<Record<string, number>>((acc, request) => {
    acc[request.branchId] = (acc[request.branchId] ?? 0) + 1;
    return acc;
  }, {});

  const rows: Array<Array<string | number | boolean | null | undefined>> = [];
  rows.push(['Branches Export']);
  rows.push(['Branch ID', 'Name', 'Agency', 'City', 'Province', 'Has backend data', 'Status', 'Contact', 'Services', 'Today visitors']);

  branches.forEach((branch) => {
    rows.push([
      branch.id,
      branch.name,
      branch.agency,
      branch.city,
      branch.province,
      branch.hasBackendData ? 'yes' : 'no',
      branch.status,
      branch.contact ?? '',
      Array.isArray(branch.services) ? branch.services.join('; ') : '',
      counts[branch.id] ?? 0,
    ]);
  });

  saveCsvFile('branches.csv', formatCsv(rows));
}
