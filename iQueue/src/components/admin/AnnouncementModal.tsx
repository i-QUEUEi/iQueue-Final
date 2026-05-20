import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useBranch } from '@/lib/branch-context';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (a: any) => void;
  initial?: any;
}

const PRIORITY_OPTIONS = ['Advisory', 'Maintenance', 'Alert', 'Other'];

export default function AnnouncementModal({ open, onClose, onSave, initial }: Props) {
  const { branches } = useBranch();
  const [form, setForm] = useState<any>({
    title: '',
    content: '',
    date: '',
    branchId: '',
    priority: 'Advisory',
    attachmentName: '',
    attachmentUrl: '',
    ...(initial || {}),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({
      title: '',
      content: '',
      date: '',
      branchId: '',
      priority: 'Advisory',
      attachmentName: '',
      attachmentUrl: '',
      ...(initial || {}),
    });
    setErrors({});
  }, [initial, open]);

  const handle = (key: string, value: any) => setForm((current: any) => ({ ...current, [key]: value }));

  const handleFile = (file?: File) => {
    if (!file) {
      setForm((current: any) => ({ ...current, attachmentName: '', attachmentUrl: '' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current: any) => ({ ...current, attachmentName: file.name, attachmentUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: any) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!form.title?.trim()) nextErrors.title = 'Title is required.';
    if (!form.content?.trim()) nextErrors.content = 'Message is required.';
    if (!form.date) nextErrors.date = 'Date is required.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      ...form,
      priority: form.priority || 'Advisory',
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Edit Announcement' : 'Add Announcement'}>
      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1C1B1F]">Title</label>
          <input
            value={form.title}
            onChange={(e) => handle('title', e.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#2D86A8] focus:outline-none focus:ring-2 focus:ring-[#2D86A8]/20"
            placeholder="Announcement headline"
          />
          {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1C1B1F]">Content</label>
          <textarea
            value={form.content}
            onChange={(e) => handle('content', e.target.value)}
            className="w-full min-h-[140px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#2D86A8] focus:outline-none focus:ring-2 focus:ring-[#2D86A8]/20"
            rows={4}
            placeholder="Write the announcement details here"
          />
          {errors.content && <p className="text-xs text-red-600">{errors.content}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1C1B1F]">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handle('date', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#2D86A8] focus:outline-none focus:ring-2 focus:ring-[#2D86A8]/20"
            />
            {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1C1B1F]">Type</label>
            <select
              value={form.priority}
              onChange={(e) => handle('priority', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#2D86A8] focus:outline-none focus:ring-2 focus:ring-[#2D86A8]/20"
            >
              {PRIORITY_OPTIONS.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1C1B1F]">Branch</label>
            <select
              value={form.branchId || ''}
              onChange={(e) => handle('branchId', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#2D86A8] focus:outline-none focus:ring-2 focus:ring-[#2D86A8]/20"
            >
              <option value="">All branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1C1B1F]">Attachment</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm"
          />
          {form.attachmentName && (
            <p className="text-xs text-gray-600">{form.attachmentName}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-3xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-[#1C1B1F] transition hover:bg-slate-200">
            Cancel
          </button>
          <button type="submit" className="rounded-3xl bg-gradient-to-r from-[#2D86A8] to-[#006288] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2D86A8]/20 transition hover:brightness-105">
            Save Announcement
          </button>
        </div>
      </form>
    </Modal>
  );
}
