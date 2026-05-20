import AdminHeader from '@/components/admin/AdminHeader';

export default function Branches() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <AdminHeader title="Branch Management" showActions={true} onRefresh={handleRefresh} />
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 pb-8">
        {/* Branches Overview */}
        <section>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">All Branches</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { name: 'Main Branch', visitors: 1247, status: 'Operational', windows: 8, staff: 12 },
              { name: 'North Branch', visitors: 892, status: 'Operational', windows: 6, staff: 9 },
              { name: 'East Branch', visitors: 654, status: 'Slow', windows: 4, staff: 6 }
            ].map((branch, idx) => (
              <div key={idx} className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    branch.status === 'Operational' ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'
                  }`}>
                    {branch.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Today's Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">{branch.visitors}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-green-300">
                    <div>
                      <p className="text-xs text-gray-600">Service Windows</p>
                      <p className="text-lg font-bold text-gray-900">{branch.windows}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Staff On Duty</p>
                      <p className="text-lg font-bold text-gray-900">{branch.staff}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Branch Performance Metrics */}
        <section>
          <div className="rounded-2xl border border-green-200 bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
            <div className="space-y-4">
              {[
                { branch: 'Main Branch', avgWait: '8.4 min', throughput: '156/hr', satisfaction: '4.5/5' },
                { branch: 'North Branch', avgWait: '7.2 min', throughput: '148/hr', satisfaction: '4.6/5' },
                { branch: 'East Branch', avgWait: '9.1 min', throughput: '136/hr', satisfaction: '4.2/5' }
              ].map((metric, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-green-50 border border-green-200 hover:border-green-400 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-900">{metric.branch}</p>
                    <div className="flex gap-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Avg Wait</p>
                        <p className="text-sm font-bold text-gray-900">{metric.avgWait}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Throughput</p>
                        <p className="text-sm font-bold text-gray-900">{metric.throughput}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Satisfaction</p>
                        <p className="text-sm font-bold text-green-600">{metric.satisfaction}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visitor Distribution & Staff Schedule */}
        <div className="grid grid-cols-2 gap-6">
          <section>
            <div className="rounded-2xl border border-green-200 bg-white shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Visitor Distribution</h3>
              <div className="h-56 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 flex items-end justify-around p-6 gap-3">
                {[
                  { branch: 'Main', visitors: 1247 },
                  { branch: 'North', visitors: 892 },
                  { branch: 'East', visitors: 654 },
                  { branch: 'West', visitors: 542 }
                ].map((item, i) => {
                  const maxVisitors = 1247;
                  const percentage = (item.visitors / maxVisitors) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg transition-all duration-300 hover:from-green-600 hover:to-emerald-500"
                        style={{ height: `${(percentage / 100) * 180}px` }}
                      ></div>
                      <p className="text-xs text-gray-700 mt-3 font-medium">{item.branch}</p>
                      <p className="text-xs font-bold text-gray-900">{item.visitors}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-green-200 bg-white shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Staff Schedule</h3>
              <div className="space-y-3">
                {[
                  { branch: 'Main Branch', morning: 'F: 4, A: 4', afternoon: 'F: 4, A: 4', evening: 'F: 2, A: 2' },
                  { branch: 'North Branch', morning: 'F: 3, A: 3', afternoon: 'F: 3, A: 3', evening: 'F: 1, A: 1' },
                  { branch: 'East Branch', morning: 'F: 2, A: 2', afternoon: 'F: 2, A: 2', evening: 'F: 1, A: 1' }
                ].map((schedule, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-green-50 border border-green-200">
                    <p className="font-semibold text-gray-900 mb-3">{schedule.branch}</p>
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
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-4">F: Facilitators, A: Assistants</p>
            </div>
          </section>
        </div>

        {/* Add New Branch */}
        <section>
          <button className="w-full rounded-2xl border-2 border-dashed border-green-400 bg-green-50 hover:bg-green-100 transition-colors duration-200 py-8 flex flex-col items-center justify-center gap-2">
            <p className="text-2xl text-green-600">+</p>
            <p className="text-sm font-semibold text-green-700">Add New Branch</p>
            <p className="text-xs text-green-600">Expand service coverage to new locations</p>
          </button>
        </section>
      </div>
    </>
  );
}
