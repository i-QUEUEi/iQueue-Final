import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import BranchOnboardingNotice from '@/components/admin/BranchOnboardingNotice';
import { useBranchData } from '@/lib/use-branch-data';
import { useTodayAtAGlance } from '@/lib/use-today-at-a-glance';
import WeeklyForecastSection from '@/components/admin/WeeklyForecastSection';
import WaitingTimeHeatmap from '@/components/admin/waiting_time_heatmap';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function AdminDashboard() {
  const { hasBranchData } = useBranchData();
  const overview = useTodayAtAGlance();
  const [refreshTime] = useState(new Date().toLocaleTimeString());

  const handleRefresh = () => {
    window.location.reload();
  };

  const todayAtAGlanceCards = [
    {
      label: 'Total visitors',
      value: overview.loading ? 'Loading…' : overview.totalVisitors.toLocaleString(),
      trend: 'up',
      change: overview.loading ? 'Waiting for live metrics' : 'Live snapshot',
    },
    {
      label: 'Current congestion',
      value: overview.loading ? 'Loading…' : overview.currentCongestion,
      trend: 'stable',
      change: overview.loading ? 'Waiting for live metrics' : 'Based on current forecast',
    },
    {
      label: 'Avg waiting time',
      value: overview.loading ? 'Loading…' : `${overview.avgWait} min`,
      trend: 'down',
      change: overview.loading ? 'Waiting for live metrics' : 'Updated from dataset',
    },
    {
      label: 'Confirmed visits',
      value: overview.loading ? 'Loading…' : overview.confirmedVisits.toLocaleString(),
      trend: 'up',
      change: overview.loading ? 'Waiting for live metrics' : 'Local visitor requests',
    },
  ];

  if (!hasBranchData) {
    return (
      <>
        <AdminHeader title="Dashboard" showActions={true} onRefresh={handleRefresh} />
        <BranchOnboardingNotice />
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Dashboard" showActions={true} onRefresh={handleRefresh} />
      <div className="border-b border-gray-200" />

      <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-8 space-y-8 pb-8" style={{ fontFamily: "'Product Sans', 'Google Sans', sans-serif" }}>
        {/* TODAY AT A GLANCE */}
        <section>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Today at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {todayAtAGlanceCards.map((card, idx) => (
              <div key={idx} className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                <div className="flex items-center gap-2">
                  {card.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : card.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                  <p className="text-xs text-gray-600">{card.change}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <WeeklyForecastSection />
        <WaitingTimeHeatmap />

        {/* ANALYTICS PREVIEW */}
        <section>
          <div className="rounded-2xl border border-blue-200 bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Avg Processing Time', value: '8.4 min', status: 'Optimal' },
                { label: 'Queue Efficiency', value: '94%', status: 'Excellent' },
                { label: 'System Uptime', value: '99.8%', status: 'Healthy' }
              ].map((metric, idx) => (
                <div key={idx} className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                  <p className="text-xs font-semibold opacity-90 mb-2">{metric.label}</p>
                  <p className="text-2xl font-bold mb-1">{metric.value}</p>
                  <p className="text-xs font-semibold mt-3 opacity-90">{metric.status}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VISITOR TRENDS & TOP SERVICES */}
        <div className="grid grid-cols-2 gap-6 items-stretch">
          <section>
            <div className="rounded-2xl border border-yellow-200 bg-white shadow-sm p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Peak Hours</h3>
              <div className="space-y-3 flex-1">
                {[
                  { hour: '9-10 AM', visitors: 247, status: 'Moderate' },
                  { hour: '10-11 AM', visitors: 312, status: 'High' },
                  { hour: '2-3 PM', visitors: 289, status: 'High' }
                ].map((peak, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-100 border border-orange-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{peak.hour}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        peak.status === 'High' ? 'bg-red-200 text-red-700' : 'bg-yellow-200 text-yellow-700'
                      }`}>  
                        {peak.status}
                      </span>
                    </div>
                    <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                        style={{ width: `${(peak.visitors / 312) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{peak.visitors} visitors</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-blue-200 bg-white shadow-sm p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Services</h3>
              <div className="space-y-3 flex-1">
                {[
                  { service: 'Driver\'s License Renewal', count: 348, percentage: 28 },
                  { service: 'Student Permit Application', count: 274, percentage: 22 },
                  { service: 'Vehicle Registration Renewal', count: 198, percentage: 16 }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900 text-md">{item.service}</span>
                      <span className="font-medium text-gray-900 text-sm">{item.count}</span>
                    </div>
                    <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{item.percentage}% of total</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* BRANCHES OVERVIEW */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Branch Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'LTO Cagayan de Oro District Office', status: 'Operational', visitors: 1247, staff: 12 },
                { name: 'SSS Lapasan Branch', status: 'Operational', visitors: 892, staff: 9 },
                { name: 'PhilHealth Regional Office X', status: 'Slow', visitors: 654, staff: 6 }
              ].map((branch, idx) => (
                <div key={idx} className="flex h-full flex-col justify-between rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-6">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-gray-900">{branch.name}</h4>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        branch.status === 'Operational' ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'
                      }`}>
                        {branch.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Today's Visitors:</span>
                        <span className="font-bold text-gray-900">{branch.visitors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Staff On Duty:</span>
                        <span className="font-bold text-gray-900">{branch.staff}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER INFO */}
        <div className="text-xs text-gray-600 text-center pt-4 border-t border-gray-200">
          <p>Last updated: {refreshTime}</p>
        </div>
      </div>
    </>
  );
}
