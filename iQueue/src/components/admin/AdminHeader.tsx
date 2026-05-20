import { useState, useEffect } from 'react';
import { HeaderBranchSelector } from '@/components/layout/HeaderBranchSelector';
import { useBranchData } from '@/lib/use-branch-data';

interface AdminHeaderProps {
  title: string;
  showActions?: boolean;
  onRefresh?: () => void;
}

export default function AdminHeader({ title, showActions = true, onRefresh }: AdminHeaderProps) {
  const [dateTime, setDateTime] = useState<string>('');
  const { hasBranchData } = useBranchData();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) + ' • ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setDateTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-sm text-gray-600">{dateTime}</p>
        </div>

        {showActions && (
          <div className="flex items-center gap-3">
            <HeaderBranchSelector />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${hasBranchData ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
              <span className={`inline-flex w-2 h-2 rounded-full ${hasBranchData ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              <span className="text-xs font-medium">{hasBranchData ? 'Live data connected' : 'Data Integration Pending'}</span>
            </div>
            <button
              onClick={onRefresh}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors duration-200 border border-gray-300"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
