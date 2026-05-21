import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from './AdminDashboard';
import Analytics from './Analytics';
import Forecast from './Forecast';
import Visits from './Visits';
import Reports from './Reports';
import Branches from './Branches';
import Announcements from './Announcements';
import SystemStatus from './SystemStatus';

export type AdminPageType = 'dashboard' | 'analytics' | 'forecast' | 'visits' | 'reports' | 'branches' | 'announcements' | 'system-status';

interface AdminLayoutProps {
  onPageChange?: (page: AdminPageType) => void;
}

const PAGE_STORAGE_KEY = 'adminCurrentPage';

export default function AdminLayout({ onPageChange }: AdminLayoutProps) {
  return <AdminLayoutContent onPageChange={onPageChange} />;
}

function AdminLayoutContent({ onPageChange }: AdminLayoutProps) {
  const getInitialPage = (): AdminPageType => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page') as AdminPageType | null;
    if (pageParam && isValidPage(pageParam)) {
      return pageParam;
    }
    const stored = sessionStorage.getItem(PAGE_STORAGE_KEY) as AdminPageType | null;
    return (stored && isValidPage(stored)) ? stored : 'dashboard';
  };

  const isValidPage = (page: string): page is AdminPageType => {
    return ['dashboard', 'analytics', 'forecast', 'visits', 'reports', 'branches', 'announcements', 'system-status'].includes(page);
  };

  const [currentPage, setCurrentPage] = useState<AdminPageType>(getInitialPage);

  const handleNavigate = (page: AdminPageType) => {
    setCurrentPage(page);
    sessionStorage.setItem(PAGE_STORAGE_KEY, page);
    const params = new URLSearchParams(window.location.search);
    params.set('page', page);
    window.history.replaceState(null, '', `?${params.toString()}`);
    onPageChange?.(page);
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') as AdminPageType | null;
      if (pageParam && isValidPage(pageParam)) {
        setCurrentPage(pageParam);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'analytics':
        return <Analytics />;
      case 'forecast':
        return <Forecast />;
      case 'visits':
        return <Visits />;
      case 'reports':
        return <Reports />;
      case 'branches':
        return <Branches />;
      case 'announcements':
        return <Announcements />;
      case 'system-status':
        return <SystemStatus />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <AdminSidebar activePage={currentPage} onPageChange={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderPageContent()}
      </div>
    </div>
  );
}
