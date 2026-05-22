import { useEffect, useMemo, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import BranchOnboardingNotice from '@/components/admin/BranchOnboardingNotice';
import { useBranchData } from '@/lib/use-branch-data';
import {
  loadVisitorFeedback,
  subscribeToVisitorStorageChanges,
  type VisitorFeedback,
} from '@/lib/visitor-storage';

function hasMeaningfulSystemIssue(value: string) {
  const normalized = value.trim().toLowerCase();
  return !['', 'no', 'none', 'n/a', 'na', 'no issue', 'no issues', 'none reported'].includes(normalized);
}

function isPredictionMismatch(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized.startsWith('no') || normalized.includes('mismatch') || normalized.includes('not');
}

function parseWaitMinutes(value: string) {
  const match = value.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function getFeedbackCategory(entry: VisitorFeedback) {
  if (hasMeaningfulSystemIssue(entry.systemIssue)) {
    return 'System';
  }

  const waitingCount = Number(entry.waitingCount);
  if (entry.crowdLevel.toLowerCase() === 'high' || (!Number.isNaN(waitingCount) && waitingCount >= 15)) {
    return 'Queue';
  }

  return 'Wait time';
}

function getFeedbackStatus(entry: VisitorFeedback) {
  if (hasMeaningfulSystemIssue(entry.systemIssue)) {
    return 'Needs review';
  }

  if (isPredictionMismatch(entry.predictionMatch)) {
    return 'Prediction gap';
  }

  if (entry.comments?.trim()) {
    return 'Visitor note';
  }

  return 'Recorded';
}

function formatSubmittedAt(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}

function getCategoryClasses(category: string) {
  if (category === 'Wait time') {
    return {
      accent: 'bg-red-50 border-red-300',
      badge: 'bg-red-200 text-red-700',
      text: 'text-red-900',
    };
  }

  if (category === 'Queue') {
    return {
      accent: 'bg-orange-50 border-orange-300',
      badge: 'bg-orange-200 text-orange-700',
      text: 'text-orange-900',
    };
  }

  return {
    accent: 'bg-yellow-50 border-yellow-300',
    badge: 'bg-yellow-200 text-yellow-700',
    text: 'text-yellow-900',
  };
}

function getStatusClasses(status: string) {
  if (status === 'Needs review') {
    return 'bg-yellow-200 text-yellow-800';
  }

  if (status === 'Prediction gap') {
    return 'bg-blue-200 text-blue-700';
  }

  if (status === 'Visitor note') {
    return 'bg-purple-200 text-purple-700';
  }

  return 'bg-emerald-200 text-emerald-700';
}

export default function Reports() {
  const { branch } = useBranchData();
  const [visitorFeedback, setVisitorFeedback] = useState<VisitorFeedback[]>([]);

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    const refreshFeedback = () => setVisitorFeedback(loadVisitorFeedback());
    refreshFeedback();
    return subscribeToVisitorStorageChanges(refreshFeedback);
  }, []);

  const branchFeedback = useMemo(() => {
    const filtered = branch
      ? visitorFeedback.filter((entry) => entry.branchId === branch.id)
      : visitorFeedback;

    return [...filtered].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [branch, visitorFeedback]);

  const liveSummary = useMemo(() => {
    const total = branchFeedback.length;
    const systemIssues = branchFeedback.filter((entry) => hasMeaningfulSystemIssue(entry.systemIssue)).length;
    const predictionGaps = branchFeedback.filter((entry) => isPredictionMismatch(entry.predictionMatch)).length;
    const withNotes = branchFeedback.filter((entry) => entry.comments?.trim()).length;
    const waitMinutes = branchFeedback
      .map((entry) => parseWaitMinutes(entry.waitTime))
      .filter((value): value is number => value !== null);

    const averageWait = waitMinutes.length
      ? Math.round(waitMinutes.reduce((sum, value) => sum + value, 0) / waitMinutes.length)
      : null;

    return { total, systemIssues, predictionGaps, withNotes, averageWait, waitResponses: waitMinutes.length };
  }, [branchFeedback]);

  if (!branch) {
    return (
      <>
        <AdminHeader title="Reports" showActions={true} onRefresh={handleRefresh} />
        <BranchOnboardingNotice />
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Reports" showActions={true} onRefresh={handleRefresh} />
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 pb-8">
        {/* Reports Summary */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Today's Reports</h2>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
              Sample data
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total reports', value: '24', change: '+4 vs daily avg' },
              { label: 'Wait time reports', value: '12', change: 'Most common' },
              { label: 'System issues', value: '3', change: 'All acknowledged' },
              { label: 'Avg helpfulness', value: '8.2/10', change: 'Community ratings' }
            ].map((stat, idx) => (
              <div key={idx} className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-red-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-700 mt-3">{stat.change}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reports by Category */}
        <section>
          <div className="rounded-2xl border border-orange-200 bg-white shadow-sm p-6 mb-6">
            <div className="mb-6 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Reports by Category</h3>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                Sample data
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { category: 'Wait time', count: 12, color: 'red' },
                { category: 'Queue issues', count: 6, color: 'orange' },
                { category: 'System problems', count: 3, color: 'yellow' },
                { category: 'Other', count: 3, color: 'purple' }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg text-center border-2 ${
                  item.color === 'red' ? 'bg-red-50 border-red-300' :
                  item.color === 'orange' ? 'bg-orange-50 border-orange-300' :
                  item.color === 'yellow' ? 'bg-yellow-50 border-yellow-300' :
                  'bg-purple-50 border-purple-300'
                }`}>
                  <p className="text-3xl font-bold text-gray-900">{item.count}</p>
                  <p className="text-sm font-medium text-gray-700 mt-2">{item.category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Crowdsourced Reports List */}
        <section>
          <div className="rounded-2xl border border-orange-200 bg-white shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">Crowdsourced Reports</h3>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                  Sample data
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors duration-200">
                  All Types
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium transition-colors duration-200">
                  Wait Time
                </button>
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: 'none' }}>
              {[
                { time: '2:45 PM', category: 'Wait time', msg: 'Queue at Window 3 is about 45 minutes.', votes: 23, status: 'Acknowledged' },
                { time: '2:30 PM', category: 'Queue', msg: 'Lobby overflow into the hallway near restrooms.', votes: 18, status: 'Under review' },
                { time: '2:15 PM', category: 'System', msg: 'Kiosk 4 hanging on barcode scan step.', votes: 12, status: 'Resolved' },
                { time: '1:50 PM', category: 'Wait time', msg: 'License Registration window taking longer than usual.', votes: 19, status: 'Acknowledged' },
                { time: '1:30 PM', category: 'Queue', msg: 'Missing signage for License Plate Issuance.', votes: 8, status: 'Under review' },
                { time: '1:15 PM', category: 'System', msg: 'Number display board not updating.', votes: 15, status: 'Resolved' },
                { time: '12:45 PM', category: 'Wait time', msg: 'Expected 20 min wait, now 35 minutes.', votes: 31, status: 'Acknowledged' },
                { time: '12:20 PM', category: 'Queue', msg: 'Temperature is too high in main lobby.', votes: 7, status: 'Forwarded' }
              ].map((report, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                  report.category === 'Wait time' ? 'bg-red-50 border-red-400' :
                  report.category === 'Queue' ? 'bg-orange-50 border-orange-400' :
                  report.category === 'System' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-purple-50 border-purple-400'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-bold px-2 py-1 rounded ${
                          report.category === 'Wait time' ? 'bg-red-200 text-red-700' :
                          report.category === 'Queue' ? 'bg-orange-200 text-orange-700' :
                          report.category === 'System' ? 'bg-yellow-200 text-yellow-700' :
                          'bg-purple-200 text-purple-700'
                        }`}>
                          {report.category}
                        </p>
                        <p className={`text-xs font-semibold px-2 py-1 rounded ${
                          report.status === 'Resolved' ? 'bg-green-200 text-green-700' :
                          report.status === 'Acknowledged' ? 'bg-blue-200 text-blue-700' :
                          report.status === 'Under review' ? 'bg-yellow-200 text-yellow-700' :
                          'bg-purple-200 text-purple-700'
                        }`}>
                          {report.status}
                        </p>
                      </div>
                      <p className={`text-sm mt-2 ${
                        report.category === 'Wait time' ? 'text-red-900' :
                        report.category === 'Queue' ? 'text-orange-900' :
                        report.category === 'System' ? 'text-yellow-900' :
                        'text-purple-900'
                      }`}>
                        {report.msg}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">{report.time}</p>
                      <p className="text-xs font-bold text-gray-700 mt-1">{report.votes} helpful</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="rounded-2xl border border-sky-200 bg-white shadow-sm p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Submitted Feedback</h3>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                    Live local data
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Feedback submitted from the landing page is shown here for <span className="font-semibold text-slate-900">{branch.name}</span>.
                </p>
              </div>
              <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                {branch.name}
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Total submitted</p>
                <p className="mt-3 text-3xl font-bold text-slate-950">{liveSummary.total}</p>
                <p className="mt-2 text-xs text-slate-600">{liveSummary.withNotes} include extra visitor notes.</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">System issues</p>
                <p className="mt-3 text-3xl font-bold text-slate-950">{liveSummary.systemIssues}</p>
                <p className="mt-2 text-xs text-slate-600">Entries where users reported a problem.</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Prediction gaps</p>
                <p className="mt-3 text-3xl font-bold text-slate-950">{liveSummary.predictionGaps}</p>
                <p className="mt-2 text-xs text-slate-600">Users said the predicted wait did not match.</p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Avg reported wait</p>
                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {liveSummary.averageWait !== null ? `${liveSummary.averageWait} min` : 'N/A'}
                </p>
                <p className="mt-2 text-xs text-slate-600">{liveSummary.waitResponses} entries included a wait-time value.</p>
              </div>
            </div>

            {branchFeedback.length ? (
              <div className="space-y-4 max-h-[560px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'none' }}>
                {branchFeedback.map((entry) => {
                  const category = getFeedbackCategory(entry);
                  const status = getFeedbackStatus(entry);
                  const categoryClasses = getCategoryClasses(category);
                  const systemIssueText = hasMeaningfulSystemIssue(entry.systemIssue) ? entry.systemIssue : 'None reported';
                  const notes = entry.comments?.trim();

                  return (
                    <div key={entry.id} className={`rounded-xl border p-5 ${categoryClasses.accent}`}>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${categoryClasses.badge}`}>
                              {category}
                            </span>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(status)}`}>
                              {status}
                            </span>
                            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
                              {entry.office}
                            </span>
                          </div>

                          <p className={`mt-3 text-sm ${categoryClasses.text}`}>
                            {notes || `Wait time: ${entry.waitTime || 'N/A'} | Crowd level: ${entry.crowdLevel || 'N/A'} | Prediction match: ${entry.predictionMatch || 'N/A'}`}
                          </p>

                          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2 xl:grid-cols-3">
                            <div className="rounded-lg bg-white/80 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Visit schedule</p>
                              <p className="mt-1 font-medium text-slate-900">{entry.date} at {entry.time}</p>
                            </div>
                            <div className="rounded-lg bg-white/80 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Wait and crowd</p>
                              <p className="mt-1 font-medium text-slate-900">{entry.waitTime || 'N/A'} • {entry.crowdLevel || 'N/A'}</p>
                            </div>
                            <div className="rounded-lg bg-white/80 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">People waiting</p>
                              <p className="mt-1 font-medium text-slate-900">{entry.waitingCount || 'N/A'}</p>
                            </div>
                            <div className="rounded-lg bg-white/80 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prediction match</p>
                              <p className="mt-1 font-medium text-slate-900">{entry.predictionMatch || 'N/A'}</p>
                            </div>
                            <div className="rounded-lg bg-white/80 p-3 md:col-span-2 xl:col-span-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">System issue</p>
                              <p className="mt-1 font-medium text-slate-900">{systemIssueText}</p>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 rounded-lg bg-white/80 px-4 py-3 text-right text-xs text-slate-500">
                          <p className="font-semibold uppercase tracking-wide text-slate-600">Submitted</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">{formatSubmittedAt(entry.submittedAt)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-sm text-slate-600">
                No submitted feedback yet for this branch. Use the landing page&apos;s <span className="font-semibold text-slate-900">Submit Your Feedback</span> form and it will appear here.
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-red-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { action: 'Acknowledge Wait Time Reports', count: '2 pending' },
                { action: 'Review System Issues', count: '1 pending' },
                { action: 'Forward Facility Reports', count: '0 pending' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  className="p-4 rounded-lg bg-white border border-orange-300 hover:bg-orange-50 transition-colors duration-200 text-left"
                >
                  <p className="font-medium text-gray-900 text-sm">{item.action}</p>
                  <p className="text-xs text-orange-600 font-semibold mt-2">{item.count}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
