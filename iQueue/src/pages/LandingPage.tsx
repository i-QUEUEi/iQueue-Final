import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useBranch } from '@/lib/branch-context';
import Footer from '@/components/layout/Footer';
import {
  addVisitorFeedback,
  addVisitorRequest,
  loadVisitorFeedback,
  loadVisitorRequests,
} from '@/lib/visitor-storage';
import type { VisitorFeedback, VisitorRequest } from '@/lib/visitor-storage';
import { fetchAnnouncements, type Announcement } from '@/lib/api';
import { useTodayAtAGlance } from '@/lib/use-today-at-a-glance';
import { HeaderBranchSelector } from '@/components/layout/HeaderBranchSelector';
import HeroSection from '@/components/enduser/HeroSection';
import WeeklyForecastSection from '@/components/admin/WeeklyForecastSection';

const WAIT_TIME_OPTIONS = [
  'Less than 15 minutes',
  '15 - 30 minutes',
  '30 - 60 minutes',
  '1 - 2 hours',
  'More than 2 hours',
];

const CROWD_OPTIONS = ['Light', 'Moderate', 'Busy', 'Very busy'];
const PREDICTION_MATCH_OPTIONS = ['Yes', 'Partially', 'No'];

export default function LandingPage() {
  const navigate = useNavigate();
  const { branches, selectedBranchId } = useBranch();
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [, setVisitorRequests] = useState<VisitorRequest[]>([]);
  const [, setVisitorFeedback] = useState<VisitorFeedback[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementLoading, setAnnouncementLoading] = useState(true);
  const [announcementError, setAnnouncementError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState<'success' | 'error'>('success');
  const overview = useTodayAtAGlance();
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [dateTime, setDateTime] = useState('');
  const [visitForm, setVisitForm] = useState({
    name: '',
    office: '',
    branchId: '',
    service: '',
    visitDate: '',
    visitTime: '',
    contact: '',
    notes: '',
  });
  const [feedbackForm, setFeedbackForm] = useState({
    office: '',
    branchId: '',
    date: '',
    time: '',
    waitTime: WAIT_TIME_OPTIONS[1],
    crowdLevel: CROWD_OPTIONS[1],
    systemIssue: 'No',
    waitingCount: '0 - 10',
    predictionMatch: PREDICTION_MATCH_OPTIONS[0],
    comments: '',
  });

  // ── Freeze background scroll when any modal is open ──
  const anyModalOpen = visitModalOpen || feedbackModalOpen;
  useEffect(() => {
    if (anyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [anyModalOpen]);

  useEffect(() => {
    setVisitorRequests(loadVisitorRequests());
    setVisitorFeedback(loadVisitorFeedback());
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setHeroVisible(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime(
        `${now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })} • ${now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}`
      );
    };
    updateDateTime();
    const timer = window.setInterval(updateDateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAnnouncements() {
      setAnnouncementLoading(true);
      setAnnouncementError(null);

      try {
        const announcementResponse = await fetchAnnouncements();
        if (!cancelled) {
          setAnnouncements(announcementResponse.announcements);
        }
      } catch (err) {
        if (!cancelled) {
          setAnnouncementError(err instanceof Error ? err.message : 'Failed to load announcements.');
        }
      } finally {
        if (!cancelled) {
          setAnnouncementLoading(false);
        }
      }
    }

    loadAnnouncements();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!branches.length) return;
    const defaultBranch = branches[0];

    if (!visitForm.branchId) {
      setVisitForm((current) => ({
        ...current,
        branchId: defaultBranch.id,
        service: current.service || defaultBranch.services[0] || '',
      }));
    }

    if (!feedbackForm.branchId) {
      setFeedbackForm((current) => ({
        ...current,
        branchId: defaultBranch.id,
      }));
    }
  }, [branches, visitForm.branchId, feedbackForm.branchId]);

  useEffect(() => {
    if (!statusMessage) return;
    const timer = window.setTimeout(() => setStatusMessage(''), 5000);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const confirmedVisits = overview.loading ? 0 : overview.confirmedVisits;
  const totalVisitors = overview.loading ? 0 : overview.totalVisitors;
  const currentCongestion = overview.loading ? 'Moderate' : overview.currentCongestion;
  const avgWaitValue = overview.loading ? 18 : overview.avgWait;

  const selectedVisitBranch = branches.find((branch) => branch.id === visitForm.branchId) || branches[0];
  const serviceOptions = selectedVisitBranch?.services || [];

  const branchById = useMemo(() => {
    return branches.reduce<Record<string, string>>((acc, branch) => {
      acc[branch.id] = branch.name;
      return acc;
    }, {});
  }, [branches]);

  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId) || branches[0];

  const groupedAnnouncements = useMemo(() => {
    return announcements.reduce<Record<'Advisory' | 'Maintenance' | 'Alert' | 'Other', Announcement[]>>(
      (acc, announcement) => {
        const key = announcement.priority;
        acc[key] = acc[key] || [];
        acc[key].push(announcement);
        return acc;
      },
      { Advisory: [], Maintenance: [], Alert: [], Other: [] }
    );
  }, [announcements]);

  const today = new Date().toISOString().slice(0, 10);

  const resetVisitForm = () => {
    setVisitForm((current) => ({
      ...current,
      name: '',
      office: '',
      visitDate: '',
      visitTime: '',
      contact: '',
      notes: '',
    }));
  };

  const resetFeedbackForm = () => {
    setFeedbackForm((current) => ({
      ...current,
      office: '',
      date: '',
      time: '',
      comments: '',
    }));
  };

  const handleVisitSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !visitForm.name ||
      !visitForm.office ||
      !visitForm.branchId ||
      !visitForm.service ||
      !visitForm.visitDate ||
      !visitForm.visitTime
    ) {
      setStatusTone('error');
      setStatusMessage('Please complete all required fields for your visit request.');
      return;
    }

    const branch = branches.find((item) => item.id === visitForm.branchId);
    const newRequest: VisitorRequest = {
      id: `visit-${Date.now()}`,
      name: visitForm.name,
      office: visitForm.office,
      branchId: visitForm.branchId,
      branchName: branch?.name || 'Selected Branch',
      service: visitForm.service,
      visitDate: visitForm.visitDate,
      visitTime: visitForm.visitTime,
      contact: visitForm.contact,
      notes: visitForm.notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    addVisitorRequest(newRequest);
    setVisitorRequests((current) => [newRequest, ...current]);
    setVisitModalOpen(false);
    setStatusTone('success');
    setStatusMessage('Your visit request was submitted. Admin can now review it.');
    resetVisitForm();
  };

  const handleFeedbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!feedbackForm.office || !feedbackForm.branchId || !feedbackForm.date || !feedbackForm.time) {
      setStatusTone('error');
      setStatusMessage('Please complete the required feedback fields before submitting.');
      return;
    }

    const branch = branches.find((item) => item.id === feedbackForm.branchId);
    const newFeedback: VisitorFeedback = {
      id: `feedback-${Date.now()}`,
      office: feedbackForm.office,
      branchId: feedbackForm.branchId,
      branchName: branch?.name || 'Selected Branch',
      date: feedbackForm.date,
      time: feedbackForm.time,
      waitTime: feedbackForm.waitTime,
      crowdLevel: feedbackForm.crowdLevel,
      systemIssue: feedbackForm.systemIssue,
      waitingCount: feedbackForm.waitingCount,
      predictionMatch: feedbackForm.predictionMatch,
      comments: feedbackForm.comments,
      submittedAt: new Date().toISOString(),
    };

    addVisitorFeedback(newFeedback);
    setVisitorFeedback((current) => [newFeedback, ...current]);
    setFeedbackModalOpen(false);
    setStatusTone('success');
    setStatusMessage('Thank you! Your feedback has been recorded.');
    resetFeedbackForm();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "'Product Sans', 'Google Sans', sans-serif" }}>

      {/* ── Header ── */}
      {statusMessage ? (
        <div className="fixed right-4 top-20 z-[70] w-[min(92vw,26rem)]">
          <div
            className={`flex items-start gap-3 rounded-3xl border px-4 py-4 shadow-xl backdrop-blur-sm ${
              statusTone === 'success'
                ? 'border-emerald-200 bg-emerald-50/95 text-emerald-900'
                : 'border-rose-200 bg-rose-50/95 text-rose-900'
            }`}
            role="status"
            aria-live="polite"
          >
            {statusTone === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {statusTone === 'success' ? 'Submission received' : 'Please check your form'}
              </p>
              <p className="mt-1 text-sm leading-6">{statusMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage('')}
              className="rounded-full px-2 py-1 text-xs font-semibold transition hover:bg-black/5"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="LogoYellow.svg" alt="iQueue" className="h-8 w-auto" />
            <div className="hidden md:block">
              <p className="text-xs text-slate-500">{dateTime}</p>
              <p className="text-xs font-medium text-slate-700">{selectedBranch?.name || 'Selected Branch'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <HeaderBranchSelector />
            <button
              onClick={() => navigate('/admin')}
              className="rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-red-700 hover:to-rose-700"
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">

        {/* ── 1. Hero ── */}
        <HeroSection
          totalVisitors={totalVisitors}
          currentCongestion={currentCongestion}
          averageWait={avgWaitValue}
          confirmedVisits={confirmedVisits}
          heroVisible={heroVisible}
          heroRef={heroRef}
          setVisitModalOpen={setVisitModalOpen}
          setFeedbackModalOpen={setFeedbackModalOpen}
        />

        {/* ── Divider ── */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-blue-400" />
          <span className="text-3xl font-bold uppercase tracking-[0.2em] text-blue-600">Announcements</span>
          <div className="h-px flex-1 bg-blue-400" />
        </div>

        {/* ── 2. Announcements ── */}
        <section>
          {announcementError ? (
            <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
              {announcementError}
            </div>
          ) : null}

          {announcementLoading ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Loading announcements…
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {(['Advisory', 'Maintenance', 'Alert', 'Other'] as const).map((priority) => {
                const categoryAnnouncements = groupedAnnouncements[priority];
                const sectionTone =
                  priority === 'Advisory' ? 'border-sky-200 bg-sky-50'
                  : priority === 'Maintenance' ? 'border-purple-200 bg-purple-50'
                  : priority === 'Alert' ? 'border-rose-200 bg-rose-50'
                  : 'border-slate-200 bg-white';

                return (
                  <section key={priority} className={`rounded-[1.75rem] border p-4 sm:p-6 ${sectionTone}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{priority} Announcements</h3>
                        <p className="text-sm text-slate-600">
                          {categoryAnnouncements.length} announcement{categoryAnnouncements.length === 1 ? '' : 's'} in this category.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      {categoryAnnouncements.length ? (
                        categoryAnnouncements.map((announcement) => (
                          <div key={announcement.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h4 className="font-semibold text-slate-900">{announcement.title}</h4>
                                <p className="mt-1 text-xs text-slate-500">{announcement.date}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <span className="rounded-full bg-slate-100 px-2 py-1">{announcement.priority}</span>
                                <span>{branchById[String(announcement.branchId)] || 'All branches'}</span>
                              </div>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-600">{announcement.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                          No announcements available in this category.
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Divider ── */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-red-400" />
          <span className="text-3xl font-bold uppercase tracking-[0.2em] text-red-600">Weekly Forecast</span>
          <div className="h-px flex-1 bg-red-400" />
        </div>

        {/* ── 3. Weekly Forecast ── */}
        <section>
              <div className="mt-6">
            <WeeklyForecastSection />
          </div>
        </section>

      </main>

      <Footer />

      {/* ── Visit Modal ── */}
      {visitModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setVisitModalOpen(false); }}
        >
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-rose-600">Visit request</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Will you visit today?</h2>
              </div>
              <button
                onClick={() => setVisitModalOpen(false)}
                className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleVisitSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Full name
                  <input
                    value={visitForm.name}
                    onChange={(event) => setVisitForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                    placeholder="Juan Dela Cruz"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  Office / service
                  <input
                    value={visitForm.office}
                    onChange={(event) => setVisitForm((current) => ({ ...current, office: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                    placeholder="LTO Service Counter"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Branch / location
                  <select
                    value={visitForm.branchId}
                    onChange={(event) => {
                      const branchId = event.target.value;
                      const branch = branches.find((item) => item.id === branchId);
                      setVisitForm((current) => ({
                        ...current,
                        branchId,
                        service: branch?.services?.[0] || current.service,
                      }));
                    }}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                    required
                  >
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  Service type
                  <select
                    value={visitForm.service}
                    onChange={(event) => setVisitForm((current) => ({ ...current, service: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                    required
                  >
                    {serviceOptions.length ? (
                      serviceOptions.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))
                    ) : (
                      <option value="">Select a service</option>
                    )}
                  </select>
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Visit date
                  <input
                    type="date"
                    min={today}
                    value={visitForm.visitDate}
                    onChange={(event) => setVisitForm((current) => ({ ...current, visitDate: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  Visit time
                  <input
                    type="time"
                    value={visitForm.visitTime}
                    onChange={(event) => setVisitForm((current) => ({ ...current, visitTime: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                    required
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-slate-700">
                Contact details
                <input
                  value={visitForm.contact}
                  onChange={(event) => setVisitForm((current) => ({ ...current, contact: event.target.value }))}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  placeholder="Email or phone (optional)"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                Notes for admin
                <textarea
                  value={visitForm.notes}
                  onChange={(event) => setVisitForm((current) => ({ ...current, notes: event.target.value }))}
                  className="min-h-[120px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  placeholder="Optional details about your request"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">Your request is saved locally and visible in the admin visits dashboard.</p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-3xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700"
                >
                  Submit request
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* ── Feedback Modal ── */}
      {feedbackModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setFeedbackModalOpen(false); }}
        >
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Visitor feedback</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Share your queue experience</h2>
              </div>
              <button
                onClick={() => setFeedbackModalOpen(false)}
                className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleFeedbackSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Public office visited
                  <input
                    value={feedbackForm.office}
                    onChange={(event) => setFeedbackForm((current) => ({ ...current, office: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="LTO CDO District Office"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  Branch / location
                  <select
                    value={feedbackForm.branchId}
                    onChange={(event) => setFeedbackForm((current) => ({ ...current, branchId: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  >
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Date of visit
                  <input
                    type="date"
                    value={feedbackForm.date}
                    onChange={(event) => setFeedbackForm((current) => ({ ...current, date: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Time of visit
                  <input
                    type="time"
                    value={feedbackForm.time}
                    onChange={(event) => setFeedbackForm((current) => ({ ...current, time: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Estimated waiting time
                  <select
                    value={feedbackForm.waitTime}
                    onChange={(event) => setFeedbackForm((current) => ({ ...current, waitTime: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  >
                    {WAIT_TIME_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  Crowd level
                  <select
                    value={feedbackForm.crowdLevel}
                    onChange={(event) => setFeedbackForm((current) => ({ ...current, crowdLevel: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  >
                    {CROWD_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  System issue reported
                  <select
                    value={feedbackForm.systemIssue}
                    onChange={(event) => setFeedbackForm((current) => ({ ...current, systemIssue: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  People waiting
                  <input
                    value={feedbackForm.waitingCount}
                    onChange={(event) => setFeedbackForm((current) => ({ ...current, waitingCount: event.target.value }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="0 - 10"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-slate-700">
                Did the experience match the prediction?
                <select
                  value={feedbackForm.predictionMatch}
                  onChange={(event) => setFeedbackForm((current) => ({ ...current, predictionMatch: event.target.value }))}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  {PREDICTION_MATCH_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                Feedback notes
                <textarea
                  value={feedbackForm.comments}
                  onChange={(event) => setFeedbackForm((current) => ({ ...current, comments: event.target.value }))}
                  className="min-h-[120px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="Share any detail about your queue or service experience"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">Feedback is stored locally and improves future branch availability.</p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700"
                >
                  Submit feedback
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
