import { useBranchData } from '@/lib/use-branch-data';

export default function BranchOnboardingNotice() {
  const { branchName } = useBranchData();

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8">
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Branch Onboarding</p>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">{branchName} is currently being onboarded.</h2>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          This location is not yet connected to live operational analytics. Branch-specific dashboards, reports, and real-time charts will be available once it is fully integrated with the platform.
        </p>
        <p className="mt-0 text-sm leading-7 text-gray-600">
          For current production data, switch to the LTO Cagayan de Oro District Office.
        </p>
        <div className="mt-3 inline-flex items-center gap-3 rounded-full bg-white px-4 py-3 border border-amber-200 shadow-sm text-sm font-medium text-amber-800">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
          Branch data is pending integration
        </div>
      </div>
    </div>
  );
}
