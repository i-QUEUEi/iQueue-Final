import AdminHeader from '@/components/admin/AdminHeader';
import BranchOnboardingNotice from '@/components/admin/BranchOnboardingNotice';
import { useBranchData } from '@/lib/use-branch-data';

export default function Analytics() {
  const { hasBranchData } = useBranchData();
  const handleRefresh = () => {
    window.location.reload();
  };

  if (!hasBranchData) {
    return (
      <>
        <AdminHeader title="Analytics" showActions={true} onRefresh={handleRefresh} />
        <BranchOnboardingNotice />
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Analytics" showActions={true} onRefresh={handleRefresh} />
      <div className="border-b border-gray-200" />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-8 space-y-8 pb-8" style={{ fontFamily: "'Product Sans', 'Google Sans', sans-serif" }}>

        {/* Operation Analytics Summary */}
        <section>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Operation Analytics</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Avg processing time', value: '8.4 min', change: '-0.6 min vs last week', trend: 'down' },
              { label: 'Daily visitor count', value: '1,247', change: '+14% vs yesterday', trend: 'up' },
              { label: 'Congestion events', value: '6', change: '+2 vs daily avg', trend: 'up' },
              { label: 'System downtime', value: '0.4%', change: 'Below 1% target', trend: 'down' }
            ].map((stat, idx) => (
              <div key={idx} className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-xs mt-3 ${stat.trend === 'down' ? 'text-green-600' : 'text-orange-600'}`}>{stat.change}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Office Performance Trends */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Office Performance Trends</h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 flex items-end justify-around p-8 gap-2 overflow-hidden">
              {[45, 52, 68, 72, 88, 92, 78, 65].map((height, i) => (
                <div key={i} className="flex-1 grid h-full grid-rows-[1fr_auto] items-end gap-3">
                  <div className="relative h-full w-full overflow-hidden rounded-t-lg bg-white/0 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 text-center">Day {i + 1}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-4">Visitor throughput over the last 8 days showing operational efficiency trends</p>
          </div>
        </section>

        {/* 7-Day Visitor Count & Service Breakdown */}
        <div className="grid grid-cols-2 gap-6 items-stretch">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">7-Day Visitor Count</h3>
            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => {
                const visitors = [1247, 1156, 1289, 1402, 1198, 892, 654][idx];
                const maxVisitors = 1402;
                const percentage = (visitors / maxVisitors) * 100;
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{day}</span>
                      <span className="text-sm font-bold text-gray-900">{visitors}</span>
                    </div>
                    <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Breakdown</h3>
            <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-3">
              {[
                { service: 'Civil Registry', count: 348, percentage: 28 },
                { service: 'Business Permit', count: 274, percentage: 22 },
                { service: 'Tax Clearance', count: 198, percentage: 16 },
                { service: 'Health Certificate', count: 156, percentage: 12 },
                { service: 'Job Application', count: 142, percentage: 11 },
                { service: 'Other Services', count: 129, percentage: 11 }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 text-sm">{item.service}</span>
                    <span className="font-bold text-gray-900 text-sm">{item.count}</span>
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
        </div>

        {/* Peak Hours Analysis */}
        <section>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Peak Hours Analysis</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { hour: '9:00 AM - 10:00 AM', visitors: 247, congestion: 'Moderate' },
                { hour: '10:00 AM - 11:00 AM', visitors: 312, congestion: 'High' },
                { hour: '2:00 PM - 3:00 PM', visitors: 289, congestion: 'High' }
              ].map((peak, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-100 border border-orange-300">
                  <p className="font-semibold text-gray-900 text-sm mb-2">{peak.hour}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">{peak.visitors}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      peak.congestion === 'High' ? 'bg-red-200 text-red-700' : 'bg-yellow-200 text-yellow-700'
                    }`}>
                      {peak.congestion}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}