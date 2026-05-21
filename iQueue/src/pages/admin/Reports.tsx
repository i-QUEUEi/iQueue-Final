import AdminHeader from '@/components/admin/AdminHeader';
import BranchOnboardingNotice from '@/components/admin/BranchOnboardingNotice';
import { useBranchData } from '@/lib/use-branch-data';

export default function Reports() {
  const { hasBranchData, isLTOCDO } = useBranchData();
  const showLiveReports = hasBranchData && isLTOCDO;

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!showLiveReports) {
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
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Today's Reports</h2>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Reports by Category</h3>
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
              <h3 className="text-lg font-semibold text-gray-900">Crowdsourced Reports</h3>
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
