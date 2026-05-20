import { useMemo, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useBranch } from '@/lib/branch-context';
import { getBranch } from '@/lib/branches';
import BranchModal from '@/components/admin/BranchModal';
import { useBranchData } from '@/lib/use-branch-data';

export default function Branches() {
  const { branches, addBranch, updateBranch, deleteBranch } = useBranch();
  const { branch: selectedBranch } = useBranchData();
  const isLiveBranch = selectedBranch?.hasBackendData;

  const serviceCategories = useMemo(() => {
    const serviceSet = new Set<string>();
    selectedBranch?.services?.forEach((service) => {
      const normalized = service.toLowerCase();
      if (normalized.includes('license')) {
        serviceSet.add('Licensing');
      } else if (normalized.includes('registration')) {
        serviceSet.add('Registration');
      } else if (normalized.includes('certificate') || normalized.includes('record')) {
        serviceSet.add('Documentation');
      } else if (normalized.includes('claim') || normalized.includes('payment')) {
        serviceSet.add('Claims & Payments');
      } else {
        serviceSet.add('General Services');
      }
    });
    return Array.from(serviceSet);
  }, [selectedBranch]);

  const scheduleCards = useMemo(
    () => branches.map(b => ({ id: b.id, morning: b.morning || 'F: 2, A: 2', afternoon: b.afternoon || 'F: 2, A: 2', evening: b.evening || 'F: 1, A: 1' })),
    [branches]
  );

  const distributionData = useMemo(() => branches.map(b => ({ id: b.id, visitors: b.visitors || 0 })), [branches]);

  const maxVisitors = useMemo(
    () => Math.max(...distributionData.map((item) => item.visitors), 1),
    [distributionData]
  );

  const handleRefresh = () => {
    window.location.reload();
  };

  const [isBranchModalOpen, setBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);

  const openAddBranch = () => { setEditingBranch(null); setBranchModalOpen(true); };
  const openEditBranch = (b: any) => { setEditingBranch(b); setBranchModalOpen(true); };

  const handleSaveBranch = (partial: any) => {
    if (editingBranch) {
      updateBranch({ ...editingBranch, ...partial });
    } else {
      addBranch(partial);
    }
  };

  const handleDeleteBranch = (id: string) => {
    deleteBranch(id);
  };


  return (
    <>
      <AdminHeader
        title={selectedBranch?.name || 'Branch Management'}
        showActions={true}
        onRefresh={handleRefresh}
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-8 space-y-8 pb-8">
        {!isLiveBranch ? (
          <>
          <section className="rounded-2xl border border-amber-200 bg-amber-50 shadow-sm p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Branch Coming Soon</p>
                <h2 className="mt-4 text-3xl font-bold text-gray-900">
                  {selectedBranch?.name || 'Selected branch'} is still onboarding.
                </h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  This location is not yet connected to live operational analytics. Branch-specific dashboards, reports, and real-time charts will be available once it is fully integrated with the platform.
                </p>
                <p className="mt-4 text-sm leading-7 text-gray-600">
                  Please switch to the LTO Cagayan de Oro District Office to view current production data.
                </p>
                <div className="mt-6 inline-flex cursor-default items-center gap-3 rounded-full bg-white px-4 py-3 border border-amber-200 shadow-sm text-sm font-medium text-amber-800">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Coming Soon branch dashboard
                </div>
              </div>
              <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Branch details</p>
                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <p><span className="font-semibold text-gray-900">Agency:</span> {selectedBranch?.agency ?? 'Unavailable'}</p>
                  <p><span className="font-semibold text-gray-900">Location:</span> {selectedBranch?.city}, {selectedBranch?.province}</p>
                  <p><span className="font-semibold text-gray-900">Address:</span> {selectedBranch?.address ?? 'Unavailable'}</p>
                  <p><span className="font-semibold text-gray-900">Services:</span> {selectedBranch?.services?.slice(0, 3).join(', ') ?? 'N/A'}</p>
                </div>
              </div>
            </div>
          </section>
          </>
        ) : (
          <>
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 h-full min-h-[220px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Branch Services</h3>
                {selectedBranch?.services?.length ? (
                  <ul className="space-y-2 text-sm text-gray-700">
                    {selectedBranch.services.map((service, idx) => (
                      <li key={idx} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        {service}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No service details available for this branch yet.</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 h-full min-h-[220px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
                {serviceCategories.length ? (
                  <div className="space-y-3">
                    {serviceCategories.map((category) => (
                      <div key={category} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-700">
                        {category}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Categories will appear once branch service data is available.</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 h-full min-h-[220px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Branch Snapshot</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p><span className="font-semibold text-gray-900">Agency:</span> {selectedBranch?.agency ?? 'Unavailable'}</p>
                  <p><span className="font-semibold text-gray-900">Location:</span> {selectedBranch?.city ?? 'Unavailable'}</p>
                  <p><span className="font-semibold text-gray-900">Address:</span> {selectedBranch?.address ?? 'Unavailable'}</p>
                  <p><span className="font-semibold text-gray-900">Contact:</span> {selectedBranch?.contact ?? 'Not available'}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">All Branches</h2>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                {branches.map((branch) => {
                  return (
                    <div key={branch.id} className="flex flex-col h-full rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{branch.agency}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <button onClick={() => openEditBranch(branch)} className="text-sm text-blue-600">Edit</button>
                          <button onClick={() => handleDeleteBranch(branch.id)} className="text-sm text-red-600">Delete</button>
                        </div>
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Today's Visitors</p>
                          <p className="text-2xl font-bold text-gray-900">{branch.visitors ?? 0}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-green-300">
                          <div>
                            <p className="text-xs text-gray-600">Service Windows</p>
                            <p className="text-lg font-bold text-gray-900">{branch.windows ?? '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Staff On Duty</p>
                            <p className="text-lg font-bold text-gray-900">{branch.staff ?? '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="rounded-2xl border border-green-200 bg-white shadow-sm p-6 h-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
                <div className="space-y-4">
                  {branches.map((metric) => {
                    return (
                      <div key={metric.id} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-green-50 border border-green-200 hover:border-green-400 transition-colors duration-200 h-full">
                        <div className="flex justify-between items-center gap-4">
                          <div>
                            <p className="font-semibold text-gray-900">{metric.name}</p>
                          </div>
                          <div className="flex gap-6 text-right">
                            <div>
                              <p className="text-xs text-gray-600">Avg Wait</p>
                              <p className="text-sm font-bold text-gray-900">{metric.avgWait ?? (metric.id === 'lto-cdo-district' ? '8.4 min' : '—')}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Throughput</p>
                              <p className="text-sm font-bold text-gray-900">{metric.throughput ?? '—'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Satisfaction</p>
                              <p className="text-sm font-bold text-green-600">{metric.satisfaction ?? '—'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
              <section className="h-full">
                <div className="h-full rounded-2xl border border-green-200 bg-white shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Visitor Distribution</h3>
                  <div className="h-44 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 flex items-end justify-around p-6 gap-3">
                    {distributionData.map((item, i) => {
                      const branchData = getBranch(item.id);
                      const percentage = Math.min(100, (item.visitors / maxVisitors) * 100);
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 min-w-[48px]">
                          <div className="w-full rounded-t-lg bg-gradient-to-t from-green-500 to-emerald-400 transition-all duration-300 hover:from-green-600 hover:to-emerald-500" style={{ height: `${Math.max(18, percentage)}%`, minHeight: '20px', width: '100%' }} />
                          <div className="text-center">
                            <p className="text-xs text-gray-700 font-medium">{branchData?.name ?? item.id}</p>
                            <p className="text-xs font-bold text-gray-900">{item.visitors}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <section className="h-full">
                <div className="h-full rounded-2xl border border-green-200 bg-white shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Staff Schedule</h3>
                  <div className="space-y-3 h-full">
                    {scheduleCards.map((schedule, idx) => {
                      const branchData = getBranch(schedule.id);
                      return (
                        <div key={idx} className="h-full p-4 rounded-lg bg-gradient-to-r from-gray-50 to-green-50 border border-green-200">
                          <p className="font-semibold text-gray-900 mb-3">{branchData?.name ?? schedule.id}</p>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div className="text-center">
                              <p className="text-gray-600 font-medium mb-1">Morning</p>
                              <p className="text-gray-900">{schedule.morning}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600 font-medium mb-1">Afternoon</p>
                              <p className="text-gray-900">{schedule.afternoon}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-600 font-medium mb-1">Evening</p>
                              <p className="text-gray-900">{schedule.evening}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-600 mt-4">F: Facilitators, A: Assistants</p>
                </div>
              </section>
            </div>

            <section>
              <button onClick={openAddBranch} className="w-full cursor-pointer rounded-2xl border-2 border-dashed border-green-400 bg-green-50 hover:bg-green-100 transition-colors duration-200 py-8 flex flex-col items-center justify-center gap-2">
                <p className="text-2xl text-green-600">+</p>
                <p className="text-sm font-semibold text-green-700">Add New Branch</p>
                <p className="text-xs text-green-600">Expand service coverage to new locations</p>
              </button>
            </section>
          </>
        )}
      </div>

      <BranchModal open={isBranchModalOpen} onClose={() => setBranchModalOpen(false)} onSave={handleSaveBranch} initial={editingBranch || undefined} />
    </>
  );
}
