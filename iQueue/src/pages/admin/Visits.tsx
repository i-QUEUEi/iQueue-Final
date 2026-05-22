import { useEffect, useMemo, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import BranchOnboardingNotice from '@/components/admin/BranchOnboardingNotice';
import { useBranch } from '@/lib/branch-context';
import { useBranchData } from '@/lib/use-branch-data';
import { loadVisitorRequests } from '@/lib/visitor-storage';
import type { VisitorRequest } from '@/lib/visitor-storage';

export default function Visits() {
  const { hasBranchData, branch } = useBranchData();
  const { branches } = useBranch();
  const [visitorRequests, setVisitorRequests] = useState<VisitorRequest[]>([]);

  useEffect(() => {
    setVisitorRequests(loadVisitorRequests());
  }, []);

  const branchRequests = useMemo(
    () => visitorRequests.filter((request) => request.branchId === branch?.id),
    [visitorRequests, branch?.id]
  );

  const totalRequests = branchRequests.length;
  const pendingCount = branchRequests.filter((request) => request.status === 'pending').length;
  const confirmedCount = branchRequests.filter((request) => request.status === 'confirmed').length;

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!hasBranchData) {
    return (
      <>
        <AdminHeader title="Confirmed Visits" showActions={true} onRefresh={handleRefresh} />
        <BranchOnboardingNotice />
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Confirmed Visits" showActions={true} onRefresh={handleRefresh} />

      <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-8 space-y-8 pb-8">
        <section>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Branch requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Total requests</p>
              <p className="text-3xl font-bold text-slate-950">{totalRequests}</p>
              <p className="text-sm text-slate-500 mt-3">Requests submitted by citizens for {branch?.name}.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Confirmed</p>
              <p className="text-3xl font-bold text-slate-950">{confirmedCount}</p>
              <p className="text-sm text-slate-500 mt-3">Requests marked confirmed or reviewed by admin.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Pending</p>
              <p className="text-3xl font-bold text-slate-950">{pendingCount}</p>
              <p className="text-sm text-slate-500 mt-3">Visitor requests still waiting for arrival or review.</p>
            </div>
          </div>
        </section>

        <section>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Visitor request queue</h3>
                <p className="text-sm text-slate-600">See visitor requests from the end-user landing page for this branch.</p>
              </div>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                {branch?.name}
              </span>
            </div>

            {branchRequests.length ? (
              <div className="max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'none' }}>
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-slate-700">Date & Time</th>
                      <th className="py-3 px-4 text-left font-semibold text-slate-700">Name</th>
                      <th className="py-3 px-4 text-left font-semibold text-slate-700">Service</th>
                      <th className="py-3 px-4 text-left font-semibold text-slate-700">Contact</th>
                      <th className="py-3 px-4 text-left font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {branchRequests.map((visit) => (
                      <tr key={visit.id} className="hover:bg-slate-50 transition-colors duration-200">
                        <td className="py-4 px-4 text-slate-900 font-medium">{visit.visitDate} {visit.visitTime}</td>
                        <td className="py-4 px-4 text-slate-700">{visit.name}</td>
                        <td className="py-4 px-4 text-slate-600">{visit.service}</td>
                        <td className="py-4 px-4 text-slate-600">{visit.contact || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            visit.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {visit.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-sm text-slate-600">
                No visitor requests have been submitted yet for this branch. Encourage users to submit a visit on the landing page.
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950 mb-4">Branch overview</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p>{branch?.fullName}</p>
              <p>{branch?.address}</p>
              <p>{branch?.city}, {branch?.province}</p>
              <p>Available services: {branch?.services.join(', ')}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950 mb-4">Branches available</h3>
            <div className="grid gap-3">
              {branches.slice(0, 6).map((branchItem) => (
                <div key={branchItem.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">{branchItem.name}</p>
                  <p className="text-xs text-slate-500">{branchItem.agency}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
