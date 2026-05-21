import AdminHeader from '@/components/admin/AdminHeader';

export default function SystemStatus() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <AdminHeader title="System Status" showActions={true} onRefresh={handleRefresh} />
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 pb-8">
        {/* System Health Summary */}
        <section>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">System Health</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'API Response Time', value: '145 ms', status: 'Healthy' },
              { label: 'Database Response', value: '89 ms', status: 'Healthy' },
              { label: 'System Uptime', value: '99.8%', status: 'Excellent' },
              { label: 'Error Rate', value: '0.02%', status: 'Healthy' }
            ].map((metric, idx) => (
              <div key={idx} className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs text-green-700 mt-3 font-semibold">{metric.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Service Health Status */}
        <section>
          <div className="rounded-2xl border border-indigo-200 bg-white shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Health Status</h3>
            <div className="space-y-4">
              {[
                { service: 'Queue Management API', status: 'Operational', uptime: '99.9%', latency: '120 ms', lastCheck: 'Just now' },
                { service: 'Database Server', status: 'Operational', uptime: '99.8%', latency: '89 ms', lastCheck: 'Just now' },
                { service: 'Authentication Service', status: 'Operational', uptime: '99.95%', latency: '87 ms', lastCheck: 'Just now' },
                { service: 'Number Display System', status: 'Operational', uptime: '99.7%', latency: '156 ms', lastCheck: 'Just now' },
                { service: 'Notification Service', status: 'Operational', uptime: '99.85%', latency: '234 ms', lastCheck: 'Just now' }
              ].map((service, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-indigo-50 border border-indigo-200 hover:border-indigo-400 transition-colors duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      <p className="font-semibold text-gray-900">{service.service}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-200 text-green-700">
                      {service.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-600">Uptime</p>
                      <p className="text-sm font-bold text-gray-900">{service.uptime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Response Time</p>
                      <p className="text-sm font-bold text-gray-900">{service.latency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Last Check</p>
                      <p className="text-sm font-bold text-gray-900">{service.lastCheck}</p>
                    </div>
                    <div className="text-right">
                      <button className="text-xs px-3 py-1 rounded bg-indigo-200 text-indigo-700 hover:bg-indigo-300 transition-colors duration-200 font-medium">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Metrics & System Logs */}
        <div className="grid grid-cols-2 gap-6">
          <section>
            <div className="rounded-2xl border border-indigo-200 bg-white shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Trends</h3>
              <div className="h-56 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl border border-indigo-200 flex items-end justify-around p-6 gap-2 overflow-hidden">
                {[45, 52, 68, 72, 78, 82, 88, 85].map((latency, i) => (
                  <div key={i} className="flex-1 grid h-full grid-rows-[1fr_auto] items-end gap-3">
                    <div className="relative h-full w-full overflow-hidden rounded-t-lg bg-white/0 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-indigo-600 hover:to-blue-500"
                        style={{ height: `${latency}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 text-center">Hour {i}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-4">Average API response time over the last 8 hours</p>
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-indigo-200 bg-white shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">System Recommendations</h3>
              <div className="space-y-3">
                {[
                  { priority: 'High', rec: 'Database connection pool at 85% capacity. Consider scaling.' },
                  { priority: 'Medium', rec: 'Cache hit rate declining. Review cache invalidation policy.' },
                  { priority: 'Medium', rec: 'SSL certificate expires in 45 days. Schedule renewal.' },
                  { priority: 'Low', rec: 'Backup logs reaching 2GB. Consider archival.' }
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                    item.priority === 'High' ? 'bg-red-50 border-red-400' :
                    item.priority === 'Medium' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-blue-50 border-blue-400'
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded whitespace-nowrap mt-0.5 ${
                        item.priority === 'High' ? 'bg-red-200 text-red-700' :
                        item.priority === 'Medium' ? 'bg-yellow-200 text-yellow-700' :
                        'bg-blue-200 text-blue-700'
                      }`}>
                        {item.priority}
                      </span>
                      <p className={`text-xs ${
                        item.priority === 'High' ? 'text-red-900' :
                        item.priority === 'Medium' ? 'text-yellow-900' :
                        'text-blue-900'
                      }`}>
                        {item.rec}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* System Logs */}
        <section>
          <div className="rounded-2xl border border-indigo-200 bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent System Logs</h3>
            <div className="max-h-64 overflow-y-auto pr-2 space-y-2" style={{ scrollbarWidth: 'none' }}>
              {[
                { time: '2:45 PM', component: 'Database', level: 'Info', msg: 'Backup completed successfully' },
                { time: '2:30 PM', component: 'API Server', level: 'Warning', msg: 'Response time exceeded 200ms threshold' },
                { time: '2:15 PM', component: 'Cache', level: 'Info', msg: 'Cache cleared and reloaded' },
                { time: '1:58 PM', component: 'Authentication', level: 'Info', msg: '2,341 users logged in' },
                { time: '1:45 PM', component: 'Queue System', level: 'Info', msg: 'Number display updated for 1,247 visitors' },
                { time: '1:30 PM', component: 'API Server', level: 'Warning', msg: 'CPU usage at 78%' },
                { time: '1:15 PM', component: 'Database', level: 'Info', msg: 'Connection pool: 42/50 active' },
                { time: '12:45 PM', component: 'Notification Service', level: 'Info', msg: 'Sent 287 SMS notifications' }
              ].map((log, idx) => (
                <div key={idx} className={`p-3 rounded-lg border border-l-4 ${
                  log.level === 'Error' ? 'bg-red-50 border-red-300' :
                  log.level === 'Warning' ? 'bg-yellow-50 border-yellow-300' :
                  'bg-gray-50 border-gray-300'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          log.level === 'Error' ? 'bg-red-200 text-red-700' :
                          log.level === 'Warning' ? 'bg-yellow-200 text-yellow-700' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {log.level}
                        </span>
                        <span className="text-xs font-semibold text-gray-600">{log.component}</span>
                      </div>
                      <p className="text-xs text-gray-700">{log.msg}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{log.time}</span>
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
