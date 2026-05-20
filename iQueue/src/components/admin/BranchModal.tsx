import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import type { Branch, AgencyType } from '@/lib/branches';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (b: Partial<Branch>) => void;
  initial?: Partial<Branch>;
}

const AGENCY_OPTIONS: AgencyType[] = ['LTO', 'SSS', 'PhilHealth', 'DFA', 'PRC', 'BIR', 'DTI', 'PSA', 'COMELEC', 'NBI', 'PagIBIG', 'Other'];
const STATUS_OPTIONS: Branch['status'][] = ['Pending', 'Live', 'Offline'];

export default function BranchModal({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<Partial<Branch>>({ ...(initial || {}), services: initial?.services || [] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({ ...(initial || {}), services: initial?.services || [] });
    setErrors({});
  }, [initial, open]);

  const handleChange = (key: keyof Branch, value: any) => setForm((current) => ({ ...current, [key]: value }));

  const handleFileChange = (file?: File) => {
    if (!file) {
      setForm((current) => ({ ...current, logoUrl: undefined }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: any) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!form.name?.trim()) nextErrors.name = 'Branch name is required.';
    if (!form.agency?.trim()) nextErrors.agency = 'Branch type is required.';
    if (!form.address?.trim()) nextErrors.address = 'Address is required.';
    if (!form.city?.trim()) nextErrors.city = 'City is required.';
    if (!form.province?.trim()) nextErrors.province = 'Province is required.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      ...form,
      services: Array.isArray(form.services) ? form.services : [],
      fullName: form.fullName || form.name || '',
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Edit Branch' : 'Add Branch'}>
      <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1C1B1F]">Branch Name</label>
            <input
              value={form.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#006288] focus:outline-none focus:ring-2 focus:ring-[#006288]/20"
              placeholder="e.g. PSA Region X"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1C1B1F]">Branch Type / Agency</label>
            <select
              value={form.agency || 'Other'}
              onChange={(e) => handleChange('agency', e.target.value as AgencyType)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#006288] focus:outline-none focus:ring-2 focus:ring-[#006288]/20"
            >
              {AGENCY_OPTIONS.map((agency) => (
                <option key={agency} value={agency}>{agency}</option>
              ))}
            </select>
            {errors.agency && <p className="text-xs text-red-600">{errors.agency}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1C1B1F]">Address</label>
            <input
              value={form.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#006288] focus:outline-none focus:ring-2 focus:ring-[#006288]/20"
            />
            {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1C1B1F]">Status</label>
            <select
              value={form.status || 'Pending'}
              onChange={(e) => handleChange('status', e.target.value as Branch['status'])}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#006288] focus:outline-none focus:ring-2 focus:ring-[#006288]/20"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1C1B1F]">City</label>
            <input
              value={form.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#006288] focus:outline-none focus:ring-2 focus:ring-[#006288]/20"
            />
            {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1C1B1F]">Province</label>
            <input
              value={form.province || ''}
              onChange={(e) => handleChange('province', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#006288] focus:outline-none focus:ring-2 focus:ring-[#006288]/20"
            />
            {errors.province && <p className="text-xs text-red-600">{errors.province}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1C1B1F]">Contact</label>
            <input
              value={form.contact || ''}
              onChange={(e) => handleChange('contact', e.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#006288] focus:outline-none focus:ring-2 focus:ring-[#006288]/20"
              placeholder="Phone or email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1C1B1F]">Services offered</label>
            <input
              value={(form.services || []).join(', ')}
              onChange={(e) => handleChange('services', e.target.value.split(',').map((s) => s.trim()))}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#006288] focus:outline-none focus:ring-2 focus:ring-[#006288]/20"
              placeholder="Comma-separated service list"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1C1B1F]">Description</label>
          <textarea
            value={form.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full min-h-[120px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm transition focus:border-[#006288] focus:outline-none focus:ring-2 focus:ring-[#006288]/20"
            placeholder="Optional branch notes"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#1C1B1F]">Logo / image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleFileChange(event.target.files?.[0])}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1C1B1F] shadow-sm"
          />
          {form.logoUrl && (
            <img src={form.logoUrl} alt="Branch logo preview" className="mt-3 h-24 w-24 rounded-3xl object-cover border border-slate-200" />
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-3xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-[#1C1B1F] transition hover:bg-slate-200">
            Cancel
          </button>
          <button type="submit" className="rounded-3xl bg-gradient-to-r from-[#F90000] to-[#D62F2F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#F90000]/20 transition hover:brightness-110">
            Save Branch
          </button>
        </div>
      </form>
    </Modal>
  );
}
