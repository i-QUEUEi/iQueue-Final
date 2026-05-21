import { type Dispatch, type RefObject, type SetStateAction } from 'react';
import WordmarkYellow from '@/assets/WordmarkYellow.png';

type HeroSectionProps = {
  totalVisitors: number;
  currentCongestion: string;
  averageWait: number;
  confirmedVisits: number;
  heroVisible: boolean;
  heroRef: RefObject<HTMLDivElement | null>;
  setVisitModalOpen: Dispatch<SetStateAction<boolean>>;
  setFeedbackModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function HeroSection({
  totalVisitors,
  currentCongestion,
  averageWait,
  confirmedVisits,
  heroVisible,
  heroRef,
  setVisitModalOpen,
  setFeedbackModalOpen,
}: HeroSectionProps) {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <div ref={heroRef} className={heroVisible ? 'hero-visible' : ''}>
        <div className="space-y-8 hero-left">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <img src={WordmarkYellow} alt="iQueue" className="h-14 w-auto" />
              <div className="hidden h-14 border-l border-slate-200 sm:block" />
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">End user portal</p>
                <p className="mt-1 text-sm font-medium text-slate-700">Queue intelligence for public service offices</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-600">Predictive Queue Intelligence for Philippine Government Offices</p>
              <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Waiting time prediction powered by machine learning, congestion forecasting, and system reliability analysis.
              </h1>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <p className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-red-500" />Waiting time prediction powered by machine learning</p>
              <p className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-amber-500" />Congestion forecasting and system reliability analysis</p>
              <p className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-cyan-500" />Real-time analytics dashboard for government offices</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => setVisitModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
              >
                <span className="material-symbols-rounded text-base">calendar_month</span>
                Will You Visit Today?
              </button>

              <button
                onClick={() => setFeedbackModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400"
              >
                <span className="material-symbols-rounded text-base">library_books</span>
                Submit Your Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 hero-right">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-600">Today at a glance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total visitors</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{totalVisitors.toLocaleString()}</p>
              <p className="mt-2 text-xs text-emerald-700">+14% vs yesterday</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current congestion</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{currentCongestion}</p>
              <p className="mt-2 text-xs text-slate-500">Within normal range</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Avg waiting time</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{averageWait} min</p>
              <p className="mt-2 text-xs text-emerald-700">-2 min improvement</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confirmed visits</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{confirmedVisits.toLocaleString()}</p>
              <p className="mt-2 text-xs text-emerald-700">27% pre-registered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
