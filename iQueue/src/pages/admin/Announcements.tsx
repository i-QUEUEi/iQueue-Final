import { useEffect, useMemo, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AnnouncementModal from '@/components/admin/AnnouncementModal';
import { useBranch } from '@/lib/branch-context';

const PRIORITY_TYPES = ['Advisory', 'Maintenance', 'Alert'] as const;

type PriorityType = (typeof PRIORITY_TYPES)[number];

type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
  branchId?: string;
  priority: PriorityType | 'Other';
  attachmentName?: string;
  attachmentUrl?: string;
};

export default function Announcements() {
  const { branches } = useBranch();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('announcements');
    if (stored) {
      try {
        setAnnouncements(JSON.parse(stored));
      } catch {
        setAnnouncements([]);
      }
    }
  }, []);

  const saveAnnouncements = (next: Announcement[]) => {
    setAnnouncements(next);
    localStorage.setItem('announcements', JSON.stringify(next));
  };

  const handleOpenNewAnnouncement = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDeleteAnnouncement = (id: string) => {
    saveAnnouncements(announcements.filter((item) => item.id !== id));
  };

  const handleSaveAnnouncement = (announcement: Announcement) => {
    const next = announcements.filter((item) => item.id !== announcement.id);
    saveAnnouncements([announcement, ...next]);
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  const grouped = useMemo(() => {
    return announcements.reduce<Record<PriorityType | 'Other', Announcement[]>>((acc, announcement) => {
      const key = PRIORITY_TYPES.includes(announcement.priority as PriorityType) ? (announcement.priority as PriorityType) : 'Other';
      acc[key] = acc[key] || [];
      acc[key].push(announcement);
      return acc;
    }, { Advisory: [], Maintenance: [], Alert: [], Other: [] });
  }, [announcements]);

  const counts = useMemo(() => ({
    advisory: grouped.Advisory.length,
    maintenance: grouped.Maintenance.length,
    alert: grouped.Alert.length,
    other: grouped.Other.length,
  }), [grouped]);

  const branchById = useMemo(() => {
    return branches.reduce<Record<string, string>>((acc, branch) => {
      acc[branch.id] = branch.name;
      return acc;
    }, {});
  }, [branches]);

  return (
    <>
      <AdminHeader title="Announcements" showActions={true} onRefresh={() => window.location.reload()} />

      <div className="flex-1 overflow-y-auto hide-scrollbar px-8 py-8 space-y-8 pb-8">
        <section>
          <button onClick={handleOpenNewAnnouncement} className="w-full rounded-2xl border-2 border-dashed border-purple-400 bg-purple-50 hover:bg-purple-100 transition-colors duration-200 py-8 flex flex-col items-center justify-center gap-2 cursor-pointer">
            <p className="text-2xl text-purple-600">+</p>
            <p className="text-sm font-semibold text-purple-700">Create New Announcement</p>
            <p className="text-xs text-purple-600">Notify visitors and staff of important updates</p>
          </button>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Active Announcements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Advisory', count: counts.advisory, color: 'blue' },
              { label: 'Maintenance', count: counts.maintenance, color: 'purple' },
              { label: 'Alert', count: counts.alert, color: 'red' },
              { label: 'Other', count: counts.other, color: 'slate' },
            ].map((item) => (
              <div key={item.label} className={`p-6 rounded-2xl text-center border-2 shadow-sm ${
                item.color === 'blue' ? 'bg-blue-50 border-blue-300 text-blue-700' :
                item.color === 'purple' ? 'bg-purple-50 border-purple-300 text-purple-700' :
                item.color === 'red' ? 'bg-red-50 border-red-300 text-red-700' :
                'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <p className="text-3xl font-bold">{item.count}</p>
                <p className="text-sm font-semibold mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {(['Advisory', 'Maintenance', 'Alert', 'Other'] as const).map((type) => (
          <section key={type}>
            <div className={`rounded-2xl border ${
              type === 'Advisory' ? 'border-blue-200 bg-blue-50' :
              type === 'Maintenance' ? 'border-purple-200 bg-purple-50' :
              type === 'Alert' ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'
            } shadow-sm p-6`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{type} Announcements</h3>
                  <p className="text-sm text-gray-600 mt-1">{grouped[type].length} announcement{grouped[type].length === 1 ? '' : 's'} in this category.</p>
                </div>
                <button onClick={handleOpenNewAnnouncement} className="text-sm text-slate-700 hover:text-slate-900 font-medium">Create announcement</button>
              </div>

              {grouped[type].length === 0 ? (
                <p className="text-sm text-gray-600">No {type.toLowerCase()} announcements yet.</p>
              ) : (
                <div className="space-y-4">
                  {grouped[type].map((announcement) => (
                    <div key={announcement.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">{announcement.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{announcement.date || 'No date set'}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-700 bg-slate-100 px-2 py-1 rounded-full">{announcement.priority}</span>
                          <span className="text-xs text-slate-500">{announcement.branchId ? branchById[announcement.branchId] ?? 'Assigned Branch' : 'All branches'}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">{announcement.content}</p>
                      {announcement.attachmentName && (
                        <div className="mt-3 text-xs text-slate-500">Attachment: {announcement.attachmentName}</div>
                      )}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button onClick={() => handleEditAnnouncement(announcement)} className="text-xs px-3 py-1 rounded bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors duration-200 font-medium">Edit</button>
                        <button onClick={() => handleDeleteAnnouncement(announcement.id)} className="text-xs px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 font-medium">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <AnnouncementModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAnnouncement(null);
        }}
        onSave={(announcement) => handleSaveAnnouncement({ ...announcement, id: announcement.id || Date.now().toString() })}
        initial={editingAnnouncement || undefined}
      />
    </>
  );
}
