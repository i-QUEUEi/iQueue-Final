import AdminHeader from '@/components/admin/AdminHeader';
import BranchOnboardingNotice from '@/components/admin/BranchOnboardingNotice';
import { useBranchData } from '@/lib/use-branch-data';

export default function Forecast() {
  const { hasBranchData } = useBranchData();
  const handleRefresh = () => {
    window.location.reload();
  };

  if (!hasBranchData) {
    return (
      <>
        <AdminHeader title="Forecast" showActions={true} onRefresh={handleRefresh} />
        <BranchOnboardingNotice />
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Forecast" showActions={true} onRefresh={handleRefresh} />
      <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-8 space-y-8 pb-8">
        {/* Tomorrow's Forecast Summary */}
        <section>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Tomorrow's Forecast</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Expected visitors', value: '130', change: '+11% vs average' },
              { label: 'Peak hour', value: '10–11 AM', change: 'Prepare staffing ahead' },
              { label: 'Predicted congestion', value: 'High', change: 'Spillover seating needed' },
              { label: 'Recommended actions', value: '3', change: 'View AI recommendations' }
            ].map((stat, idx) => (
              <div key={idx} className="rounded-2xl border border-orange-200 bg-gradient-to-br from-yellow-50 to-orange-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-700 mt-3">{stat.change}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5-Day Forecast */}
        <section>
          <div className="rounded-2xl border border-orange-200 bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">5-Day Visitor Forecast</h3>
            <div className="h-64 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl border border-orange-200 flex items-end justify-around p-8 gap-3 overflow-hidden">
              {[
                { day: 'Monday', visitors: 1380 },
                { day: 'Tuesday', visitors: 1240 },
                { day: 'Wednesday', visitors: 1510 },
                { day: 'Thursday', visitors: 1420 },
                { day: 'Friday', visitors: 1620 }
              ].map((item, i) => {
                const maxVisitors = 1620;
                const percentage = (item.visitors / maxVisitors) * 100;
                return (
                  <div key={i} className="flex-1 grid h-full grid-rows-[1fr_auto_auto] items-end gap-3 min-w-0">
                    <div className="relative h-full w-full overflow-hidden rounded-t-2xl bg-white/0">
                      <div
                        className="absolute bottom-0 left-0 w-full rounded-t-2xl bg-gradient-to-t from-orange-500 to-yellow-400 transition-all duration-300 hover:from-orange-600 hover:to-yellow-500"
                        style={{ height: `${percentage}%`, minHeight: '10%' }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 text-center font-medium">{item.day}</p>
                    <p className="text-xs font-bold text-gray-900 text-center">{item.visitors}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tomorrow's Hourly Breakdown & Crowd Density */}
        <div className="grid grid-cols-2 gap-6 items-stretch">
          <section>
            <div className="rounded-2xl border border-orange-200 bg-white shadow-sm p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Tomorrow's Hourly Breakdown</h3>
              <div className="space-y-3 flex-1">
                {[
                  { hour: '8:00–9:00 AM', visitors: 120, status: 'Low' },
                  { hour: '9:00–10:00 AM', visitors: 280, status: 'Medium' },
                  { hour: '10:00–11:00 AM', visitors: 420, status: 'High' },
                  { hour: '11:00 AM–12:00 PM', visitors: 340, status: 'High' },
                  { hour: '2:00–3:00 PM', visitors: 220, status: 'Medium' }
                ].map((slot, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:border-orange-300 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 text-sm">{slot.hour}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        slot.status === 'High' ? 'bg-red-200 text-red-700' :
                        slot.status === 'Medium' ? 'bg-yellow-200 text-yellow-700' :
                        'bg-green-200 text-green-700'
                      }`}>
                        {slot.status}
                      </span>
                    </div>
                    <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                        style={{ width: `${(slot.visitors / 420) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{slot.visitors} visitors expected</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-orange-200 bg-white shadow-sm p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Crowd Density Forecast</h3>
              <div className="space-y-4 flex-1">
                {[
                  { area: 'Main Lobby', density: 'High', recommendation: 'Open spillover seating' },
                  { area: 'Queue Line 1', density: 'Very High', recommendation: 'Add temporary barriers' },
                  { area: 'Queue Line 2', density: 'High', recommendation: 'Deploy second facilitator' },
                  { area: 'Waiting Area', density: 'Very High', recommendation: 'Activate overflow area' },
                  { area: 'Service Windows', density: 'High', recommendation: 'Increase staffing' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-100 border border-orange-300 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-semibold text-gray-900 text-sm">{item.area}</p>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        item.density === 'Very High' ? 'bg-red-200 text-red-700' : 'bg-orange-200 text-orange-700'
                      }`}>
                        {item.density}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700">Action: {item.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* AI Recommendations */}
        <section>
          <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-yellow-50 to-orange-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Recommendations for Tomorrow</h3>
            <div className="space-y-3 flex-1">
              {[
                { priority: 'High', recommendation: 'Increase staffing at Window 3 during 10–11 AM peak by 2 additional personnel' },
                { priority: 'High', recommendation: 'Open Lobby B spillover seating area at 9:30 AM to manage crowd' },
                { priority: 'Medium', recommendation: 'Send SMS to 42 confirmed visitors in 10–11 AM slot suggesting 9–9:30 AM arrival' },
                { priority: 'Medium', recommendation: 'Deploy crowd facilitator to main queue at 10:00 AM' }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                  item.priority === 'High'
                    ? 'bg-red-50 border-red-400'
                    : 'bg-yellow-50 border-yellow-400'
                }`}>
                  <div className="flex items-start gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
                      item.priority === 'High' ? 'bg-red-200 text-red-700' : 'bg-yellow-200 text-yellow-700'
                    }`}>
                      {item.priority} Priority
                    </span>
                    <p className={`text-sm ${item.priority === 'High' ? 'text-red-900' : 'text-yellow-900'}`}>
                      {item.recommendation}
                    </p>
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
