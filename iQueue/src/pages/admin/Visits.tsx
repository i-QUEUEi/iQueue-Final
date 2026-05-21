import AdminHeader from '@/components/admin/AdminHeader';
import BranchOnboardingNotice from '@/components/admin/BranchOnboardingNotice';
import { useBranchData } from '@/lib/use-branch-data';

export default function Visits() {
  const { hasBranchData } = useBranchData();
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
        {/* Confirmed Visits Summary */}
        <section>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Today's Summary</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total confirmed', value: '342', change: '87% check-in rate' },
              { label: 'Checked in', value: '297', change: 'By 2:00 PM' },
              { label: 'Pending arrival', value: '45', change: 'Arriving after 2:30 PM' },
              { label: 'No-shows', value: '8', change: '2.3% no-show rate' }
            ].map((stat, idx) => (
              <div key={idx} className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-700 mt-3">{stat.change}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Expected Arrivals */}
        <section>
          <div className="rounded-2xl border border-blue-200 bg-white shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Expected Arrivals Today</h3>
              <div className="text-xs font-medium text-gray-600">342 confirmed visits</div>
            </div>
            <div className="max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: 'none' }}>
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Branch</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { time: '9:15 AM', name: 'J. Reyes', service: 'Civil Registry', branch: 'Main', status: 'Checked in' },
                    { time: '9:30 AM', name: 'M. Santos', service: 'Business Permit', branch: 'Main', status: 'Checked in' },
                    { time: '10:00 AM', name: 'R. Cruz', service: 'Tax Clearance', branch: 'Main', status: 'Checked in' },
                    { time: '10:15 AM', name: 'L. Tan', service: 'Health Certificate', branch: 'North', status: 'Checked in' },
                    { time: '10:45 AM', name: 'A. Benitiz', service: 'Civil Registry', branch: 'Main', status: 'Checked in' },
                    { time: '11:00 AM', name: 'K. Lopez', service: 'Job Application', branch: 'East', status: 'Pending' },
                    { time: '11:30 AM', name: 'S. Garcia', service: 'Business Permit', branch: 'Main', status: 'Pending' },
                    { time: '2:00 PM', name: 'P. Rodriguez', service: 'Tax Clearance', branch: 'North', status: 'Pending' },
                    { time: '2:45 PM', name: 'M. Villanueva', service: 'Civil Registry', branch: 'Main', status: 'Pending' },
                    { time: '3:30 PM', name: 'D. Fernandez', service: 'Health Certificate', branch: 'East', status: 'Pending' }
                  ].map((visit, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 transition-colors duration-200 ${
                      visit.status === 'Checked in' ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <td className="py-3 px-4 font-medium text-gray-900">{visit.time}</td>
                      <td className="py-3 px-4 text-gray-700">{visit.name}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{visit.service}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{visit.branch}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          visit.status === 'Checked in'
                            ? 'bg-green-200 text-green-700'
                            : 'bg-blue-200 text-blue-700'
                        }`}>
                          {visit.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Hourly Confirmed Visits Chart */}
        <section>
          <div className="rounded-2xl border border-blue-200 bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Hourly Confirmed Visits</h3>
            <div className="h-56 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border border-blue-200 flex items-end justify-around p-8 gap-2 overflow-hidden">
              {[42, 68, 92, 78, 65, 48, 32, 18].map((count, i) => (
                <div key={i} className="flex-1 grid h-full grid-rows-[1fr_auto] items-end gap-3">
                  <div className="relative h-full w-full overflow-hidden rounded-t-lg bg-white/0 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-cyan-500"
                      style={{ height: `${count}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 text-center">9-{10 + i}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Confirmed vs Pending Analysis */}
        <div className="grid grid-cols-2 gap-6 items-stretch">
          <section>
            <div className="rounded-2xl border border-blue-200 bg-white shadow-sm p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Check-in Trend</h3>
              <div className="space-y-3 flex-1">
                {[
                  { time: 'By 10:00 AM', checked: 127, percentage: 85 },
                  { time: 'By 12:00 PM', checked: 208, percentage: 89 },
                  { time: 'By 2:00 PM', checked: 297, percentage: 87 }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{item.time}</span>
                      <span className="font-bold text-blue-600">{item.checked} checked in</span>
                    </div>
                    <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{item.percentage}% on-time arrival</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-blue-200 bg-white shadow-sm p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Distribution</h3>
              <div className="space-y-3 flex-1">
                {[
                  { service: 'Civil Registry', count: 89, confirmed: 78 },
                  { service: 'Business Permit', count: 67, confirmed: 59 },
                  { service: 'Tax Clearance', count: 54, confirmed: 48 },
                  { service: 'Health Certificate', count: 45, confirmed: 39 },
                  { service: 'Job Application', count: 42, confirmed: 35 },
                  { service: 'Other Services', count: 45, confirmed: 38 }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-gray-900 text-sm">{item.service}</span>
                      <span className="text-xs font-bold text-gray-700">{item.confirmed}/{item.count}</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        style={{ width: `${(item.confirmed / item.count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
