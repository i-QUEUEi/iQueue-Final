import AdminHeader from '@/components/admin/AdminHeader';

export default function Announcements() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <AdminHeader title="Announcements" showActions={true} onRefresh={handleRefresh} />
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 pb-8">
        {/* Create New Announcement */}
        <section>
          <button className="w-full rounded-2xl border-2 border-dashed border-purple-400 bg-purple-50 hover:bg-purple-100 transition-colors duration-200 py-8 flex flex-col items-center justify-center gap-2">
            <p className="text-2xl text-purple-600">+</p>
            <p className="text-sm font-semibold text-purple-700">Create New Announcement</p>
            <p className="text-xs text-purple-600">Notify visitors and staff of important updates</p>
          </button>
        </section>

        {/* Active Announcements by Type */}
        <section>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Active Announcements</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { type: 'Advisory', count: 2, color: 'blue' },
              { type: 'Maintenance', count: 1, color: 'purple' },
              { type: 'Alert', count: 1, color: 'red' }
            ].map((item, idx) => (
              <div key={idx} className={`p-6 rounded-2xl text-center border-2 shadow-sm ${
                item.color === 'blue' ? 'bg-blue-50 border-blue-300' :
                item.color === 'purple' ? 'bg-purple-50 border-purple-300' :
                'bg-red-50 border-red-300'
              }`}>
                <p className={`text-3xl font-bold ${
                  item.color === 'blue' ? 'text-blue-600' :
                  item.color === 'purple' ? 'text-purple-600' :
                  'text-red-600'
                }`}>
                  {item.count}
                </p>
                <p className={`text-sm font-semibold mt-2 ${
                  item.color === 'blue' ? 'text-blue-700' :
                  item.color === 'purple' ? 'text-purple-700' :
                  'text-red-700'
                }`}>
                  {item.type}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Advisory Announcements */}
        <section>
          <div className="rounded-2xl border border-blue-200 bg-white shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advisory Announcements</h3>
            <div className="space-y-3">
              {[
                { title: 'Reduced hours on May 20 (Holiday)', date: 'Published: May 18, 2026', status: 'Active' },
                { title: 'New online appointment system launching June 1', date: 'Published: May 17, 2026', status: 'Scheduled' }
              ].map((announcement, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-300 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{announcement.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{announcement.date}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                      announcement.status === 'Active' ? 'bg-green-200 text-green-700' : 'bg-blue-200 text-blue-700'
                    }`}>
                      {announcement.status}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs px-3 py-1 rounded bg-blue-200 text-blue-700 hover:bg-blue-300 transition-colors duration-200 font-medium">Edit</button>
                    <button className="text-xs px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 font-medium">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Maintenance Announcements */}
        <section>
          <div className="rounded-2xl border border-purple-200 bg-white shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Announcements</h3>
            <div className="space-y-3">
              {[
                { title: 'System maintenance scheduled 2 AM–4 AM May 25', date: 'Published: May 18, 2026', status: 'Active' }
              ].map((announcement, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-300 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{announcement.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{announcement.date}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                      announcement.status === 'Active' ? 'bg-green-200 text-green-700' : 'bg-blue-200 text-blue-700'
                    }`}>
                      {announcement.status}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs px-3 py-1 rounded bg-purple-200 text-purple-700 hover:bg-purple-300 transition-colors duration-200 font-medium">Edit</button>
                    <button className="text-xs px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 font-medium">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alert Announcements */}
        <section>
          <div className="rounded-2xl border border-red-200 bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Announcements</h3>
            <div className="space-y-3">
              {[
                { title: 'Window 2 offline for repairs', date: 'Published: May 19, 2026 - 10:30 AM', status: 'Active' }
              ].map((announcement, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border border-red-300 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{announcement.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{announcement.date}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                      announcement.status === 'Active' ? 'bg-green-200 text-green-700' : 'bg-blue-200 text-blue-700'
                    }`}>
                      {announcement.status}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs px-3 py-1 rounded bg-red-200 text-red-700 hover:bg-red-300 transition-colors duration-200 font-medium">Edit</button>
                    <button className="text-xs px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 font-medium">Delete</button>
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
