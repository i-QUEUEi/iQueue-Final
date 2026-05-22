import { useEffect, useRef, useState } from "react";
import type { AdminPageType } from '@/pages/admin/AdminLayout';
import { useNavigate } from 'react-router-dom';
import {
  exportAnalyticsCsv,
  exportBranchesCsv,
  exportForecastCsv,
  exportReportsCsv,
  exportVisitsCsv,
} from '@/lib/export-csv';

interface SidebarItem {
  label: string;
  icon: string;
  section: 'overview' | 'operations' | 'system';
}

const SIDEBAR_ITEMS: { [key: string]: SidebarItem[] } = {
  overview: [
    { label: 'Dashboard', icon: 'dashboard', section: 'overview' },
    { label: 'Analytics', icon: 'analytics', section: 'overview' },
    { label: 'Forecast', icon: 'trending_up', section: 'overview' }
  ],
  operations: [
    { label: 'Visits', icon: 'people', section: 'operations' },
    { label: 'Reports', icon: 'description', section: 'operations' },
    { label: 'Branches', icon: 'location_on', section: 'operations' },
    { label: 'Announcements', icon: 'notifications', section: 'operations' },
    { label: 'Export', icon: 'download', section: 'operations' }
  ]
};

interface AdminSidebarProps {
  activePage: AdminPageType;
  onPageChange: (page: AdminPageType) => void;
}

const mapLabelToPage = (label: string): AdminPageType => {
  const mapping: { [key: string]: AdminPageType } = {
    'dashboard': 'dashboard',
    'analytics': 'analytics',
    'forecast': 'forecast',
    'visits': 'visits',
    'reports': 'reports',
    'branches': 'branches',
    'announcements': 'announcements',
  };
  return mapping[label.toLowerCase()] || 'dashboard';
};

// Export option definitions — each has its own page icon
const EXPORT_OPTIONS = [
  { key: 'analytics', label: 'Analytics',  icon: 'analytics'    },
  { key: 'forecast',  label: 'Forecast',   icon: 'trending_up'  },
  { key: 'visits',    label: 'Visits',     icon: 'people'       },
  { key: 'reports',   label: 'Reports',    icon: 'description'  },
  { key: 'branches',  label: 'Branches',   icon: 'location_on'  },
] as const;

type ExportKey = (typeof EXPORT_OPTIONS)[number]['key'];

export default function AdminSidebar({ activePage, onPageChange }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportOption = async (option: ExportKey) => {
    setExportOpen(false);
    switch (option) {
      case 'analytics': await exportAnalyticsCsv(); break;
      case 'forecast':  await exportForecastCsv();  break;
      case 'visits':    exportVisitsCsv();           break;
      case 'reports':   exportReportsCsv();          break;
      case 'branches':  exportBranchesCsv();         break;
    }
  };

  const allSections = [
    { key: 'overview',    label: 'Overview',    items: SIDEBAR_ITEMS.overview    },
    { key: 'operations',  label: 'Operations',  items: SIDEBAR_ITEMS.operations  },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,300,0,0" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; }

        /* ── Shell ── */
        .admin-sidebar {
          font-family: 'Google Sans', 'Product Sans', sans-serif;
          width: 250px; min-width: 250px;
          background: #ffffff;
          border-right: 1px solid #f0f0f2;
          height: 100vh;
          display: flex; flex-direction: column;
          overflow: hidden; position: relative;
          transition: width 0.38s cubic-bezier(0.4,0,0.2,1),
                      min-width 0.38s cubic-bezier(0.4,0,0.2,1);
        }
        .admin-sidebar.collapsed { width: 72px; min-width: 72px; }

        /* ── Logo / toggle ── */
        .sidebar-logo {
          padding: 20px 16px;
          border-bottom: 1px solid #f0f0f2;
          display: flex; align-items: center; gap: 10px;
          overflow: hidden; flex-shrink: 0;
          cursor: pointer; user-select: none;
          transition: padding 0.38s cubic-bezier(0.4,0,0.2,1);
        }
        .admin-sidebar.collapsed .sidebar-logo { justify-content: center; }
        .sidebar-logo-mark {
          width: 40px; height: 40px; min-width: 40px;
          background: linear-gradient(135deg, #F90000, #D62F2F);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(249,0,0,0.25);
          transition: box-shadow 0.22s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
          position: relative; overflow: hidden; flex-shrink: 0;
        }
        .sidebar-logo:hover .sidebar-logo-mark {
          box-shadow: 0 5px 18px rgba(249,0,0,0.42);
          transform: scale(1.06);
        }
        .sidebar-logo:active .sidebar-logo-mark { transform: scale(0.97); }
        .logo-text-iq {
          color: white; font-weight: 700; font-size: 15px; letter-spacing: -0.5px;
          position: relative; z-index: 1;
          transition: opacity 0.18s, transform 0.2s cubic-bezier(0.4,0,0.2,1);
        }
        .sidebar-logo:hover .logo-text-iq { opacity: 0; transform: scale(0.65); }
        .logo-chevron {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #c72020, #991a1a);
          border-radius: 10px;
          opacity: 0; transform: scale(0.75);
          transition: opacity 0.18s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .sidebar-logo:hover .logo-chevron { opacity: 1; transform: scale(1); }
        .logo-chevron .material-symbols-rounded {
          font-size: 20px; color: white;
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          transition: transform 0.38s cubic-bezier(0.4,0,0.2,1);
        }
        .admin-sidebar.collapsed .logo-chevron .material-symbols-rounded { transform: rotate(180deg); }
        .sidebar-logo-text {
          overflow: hidden; white-space: nowrap;
          opacity: 1; transform: translateX(0); max-width: 200px;
          transition: opacity 0.26s cubic-bezier(0.4,0,0.2,1),
                      transform 0.26s cubic-bezier(0.4,0,0.2,1),
                      max-width 0.38s cubic-bezier(0.4,0,0.2,1);
        }
        .admin-sidebar.collapsed .sidebar-logo-text {
          opacity: 0; transform: translateX(-10px); max-width: 0; pointer-events: none;
        }
        .sidebar-logo-text h2 { font-size: 15px; font-weight: 600; color: #1C1B1F; margin: 0; line-height: 1.2; }
        .sidebar-logo-text p  { font-size: 11px; color: #9e9ea7; margin: 0; line-height: 1.4; }

        /* ── Nav ── */
        .sidebar-nav {
          flex: 1; padding: 28px 10px;
          display: flex; flex-direction: column; gap: 24px;
          overflow-y: auto; overflow-x: hidden;
          scrollbar-width: none; -ms-overflow-style: none;
          transition: padding 0.38s cubic-bezier(0.4,0,0.2,1);
        }
        .sidebar-nav::-webkit-scrollbar { display: none; }
        .admin-sidebar.collapsed .sidebar-nav { padding: 28px 0; align-items: center; }

        .sidebar-section { display: flex; flex-direction: column; width: 100%; }
        .admin-sidebar.collapsed .sidebar-section { width: 44px; }

        .sidebar-section-label {
          font-size: 12px; font-weight: 600; color: #b0b0ba;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 0 10px; margin-bottom: 6px;
          white-space: nowrap; overflow: hidden;
          opacity: 1; max-height: 20px;
          transition: opacity 0.22s 0.04s, max-height 0.28s, margin-bottom 0.28s;
        }
        .admin-sidebar.collapsed .sidebar-section-label {
          opacity: 0; max-height: 0; margin-bottom: 0; pointer-events: none;
        }

        .sidebar-btn-group { display: flex; flex-direction: column; gap: 2px; }

        /* ── Nav button ── */
        .sidebar-btn {
          width: 100%; border: none; background: transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: flex-start;
          gap: 10px; padding: 9px 10px; border-radius: 10px;
          position: relative; overflow: hidden;
          transition: background 0.18s, padding 0.38s cubic-bezier(0.4,0,0.2,1);
          animation: sidebar-fade-in 0.3s cubic-bezier(0.4,0,0.2,1) both;
        }
        .admin-sidebar.collapsed .sidebar-btn {
          height: 44px; padding: 0; justify-content: center;
        }
        .sidebar-btn::before {
          content: ''; position: absolute; inset: 0; border-radius: 10px;
          background: linear-gradient(135deg, #F90000, #D62F2F);
          opacity: 0; transition: opacity 0.2s;
        }
        .sidebar-btn.active::before { opacity: 1; }
        .sidebar-btn:not(.active):hover { background: #f5f5f8; }

        .sidebar-btn-icon {
          font-size: 20px; color: #9292a0; flex-shrink: 0;
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          width: 20px; height: 20px; line-height: 1;
          transition: color 0.18s, transform 0.24s cubic-bezier(0.34,1.56,0.64,1);
        }
        .sidebar-btn.active .sidebar-btn-icon { color: white; }
        .sidebar-btn:not(.active):hover .sidebar-btn-icon { color: #F90000; transform: scale(1.2) rotate(-5deg); }

        .sidebar-btn-label {
          margin-left: 6px; font-size: 15px; font-weight: 500; color: #1C1B1F;
          white-space: nowrap; overflow: hidden;
          opacity: 1; max-width: 160px;
          transition: opacity 0.24s, max-width 0.38s, color 0.18s;
          position: relative; z-index: 1;
        }
        .sidebar-btn.active .sidebar-btn-label { color: white; }
        .admin-sidebar.collapsed .sidebar-btn-label {
          opacity: 0; max-width: 0; pointer-events: none; margin-left: 0;
        }

        .sidebar-btn-tooltip {
          position: fixed; left: 80px;
          transform: translateY(-50%) translateX(-6px) scale(0.92);
          background: #1C1B1F; color: #fff;
          font-size: 12px; font-weight: 500;
          padding: 5px 10px; border-radius: 7px;
          white-space: nowrap; opacity: 0; pointer-events: none;
          transition: opacity 0.16s, transform 0.16s;
          z-index: 9999; box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }
        .sidebar-btn-tooltip::before {
          content: ''; position: absolute; left: -4px; top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 8px; height: 8px; background: #1C1B1F; border-radius: 1px;
        }
        .admin-sidebar.collapsed .sidebar-btn:hover .sidebar-btn-tooltip {
          opacity: 1; transform: translateY(-50%) translateX(0) scale(1);
        }

        .sidebar-divider {
          height: 1px; background: #f0f0f2;
          margin: -8px -10px 16px;
        }
        .admin-sidebar.collapsed .sidebar-divider { margin: -8px 0 16px; }

        /* ══════════════════════════════════════
           EXPORT — Downward icon-circle speed-dial
        ══════════════════════════════════════ */
        .sidebar-export-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
        }
        .admin-sidebar.collapsed .sidebar-export-wrapper {
          width: 44px;
          align-items: center;
        }

        /* Trigger button — transparent until opened or hovered */
        .sidebar-export-trigger {
          width: 100%;
          border: none; cursor: pointer;
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 10px;
          position: relative; overflow: hidden;
          background: transparent;
          box-shadow: none;
          transition: background 0.18s ease, box-shadow 0.22s, transform 0.18s, color 0.18s;
          animation: sidebar-fade-in 0.3s cubic-bezier(0.4,0,0.2,1) both;
          z-index: 1;
        }
        .admin-sidebar.collapsed .sidebar-export-trigger {
          width: 44px; height: 44px; padding: 0; justify-content: center;
        }
        .sidebar-export-trigger:hover {
          background: linear-gradient(135deg, #F90000, #D62F2F);
          color: white;
          box-shadow: 0 6px 22px rgba(249,0,0,0.24);
        }
        .sidebar-export-trigger:active { transform: scale(0.97); }
        .sidebar-export-trigger .sidebar-btn-icon {
          color: #F90000;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), color 0.18s;
        }
        .sidebar-export-trigger:hover .sidebar-btn-icon {
          color: white;
        }
        .sidebar-export-trigger.open {
          background: linear-gradient(135deg, #F90000, #D62F2F);
          color: white;
          box-shadow: 0 6px 22px rgba(249,0,0,0.24);
        }
        .sidebar-export-trigger.open .sidebar-btn-icon {
          color: white;
          transform: rotate(45deg);
        }
        .sidebar-export-trigger .sidebar-btn-label {
          color: #D62F2F;
        }
        .sidebar-export-trigger:hover .sidebar-btn-label,
        .sidebar-export-trigger.open .sidebar-btn-label {
          color: white;
        }

        /* ── Downward icon-circle menu ── */
        .sidebar-export-menu {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          padding-top: 6px;
          /* collapsed → centre circles */
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          pointer-events: none;
          transition: max-height 0.32s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.22s cubic-bezier(0.4,0,0.2,1),
                      padding-top 0.22s;
        }
        .sidebar-export-menu.open {
          max-height: 320px;
          opacity: 1;
          pointer-events: auto;
          padding-top: 6px;
        }
        .admin-sidebar.collapsed .sidebar-export-menu {
          align-items: center;
        }

        /* Each icon circle */
        .sidebar-export-item {
          display: flex;
          align-items: center;
          gap: 10px;
          border: none;
          cursor: pointer;
          background: transparent;
          padding: 0;
          font-family: 'Google Sans', 'Product Sans', sans-serif;
          /* entrance */
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.18s, transform 0.18s;
        }
        .sidebar-export-menu.open .sidebar-export-item {
          opacity: 1;
          transform: translateY(0);
        }
        .sidebar-export-menu.open .sidebar-export-item:nth-child(1) { transition-delay: 0.03s; }
        .sidebar-export-menu.open .sidebar-export-item:nth-child(2) { transition-delay: 0.07s; }
        .sidebar-export-menu.open .sidebar-export-item:nth-child(3) { transition-delay: 0.11s; }
        .sidebar-export-menu.open .sidebar-export-item:nth-child(4) { transition-delay: 0.15s; }
        .sidebar-export-menu.open .sidebar-export-item:nth-child(5) { transition-delay: 0.19s; }

        /* The circle itself */
        .sidebar-export-item-circle {
          width: 34px; height: 34px; min-width: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F90000, #D62F2F);
          box-shadow: 0 3px 10px rgba(249,0,0,0.30);
          display: flex; align-items: center; justify-content: center;
          transition: box-shadow 0.18s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1),
                      filter 0.18s;
          flex-shrink: 0;
        }
        .sidebar-export-item:hover .sidebar-export-item-circle {
          box-shadow: 0 6px 18px rgba(249,0,0,0.44);
          filter: brightness(1.1);
          transform: scale(1.12);
        }
        .sidebar-export-item:active .sidebar-export-item-circle { transform: scale(0.94); }

        .sidebar-export-item-icon {
          font-size: 16px;
          color: white;
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          line-height: 1;
          display: flex; align-items: center; justify-content: center;
        }

        /* Label beside circle — hidden when collapsed */
        .sidebar-export-item-label {
          font-size: 13px; font-weight: 500; color: #1C1B1F;
          white-space: nowrap;
          opacity: 1; max-width: 120px;
          transition: opacity 0.24s, max-width 0.38s;
        }
        .admin-sidebar.collapsed .sidebar-export-item-label {
          opacity: 0; max-width: 0; pointer-events: none; overflow: hidden;
        }

        /* Tooltip for collapsed icon circles */
        .sidebar-export-item-tooltip {
          position: fixed;
          left: 80px;
          transform: translateY(-50%) translateX(-6px) scale(0.92);
          background: #1C1B1F; color: #fff;
          font-size: 12px; font-weight: 500;
          padding: 5px 10px; border-radius: 7px;
          white-space: nowrap; opacity: 0; pointer-events: none;
          transition: opacity 0.16s, transform 0.16s;
          z-index: 9999; box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }
        .sidebar-export-item-tooltip::before {
          content: ''; position: absolute; left: -4px; top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 8px; height: 8px; background: #1C1B1F; border-radius: 1px;
        }
        .admin-sidebar.collapsed .sidebar-export-item:hover .sidebar-export-item-tooltip {
          opacity: 1; transform: translateY(-50%) translateX(0) scale(1);
        }

        /* ── Footer ── */
        .sidebar-footer {
          padding: 12px 10px;
          border-top: 1px solid #f0f0f2;
          flex-shrink: 0; overflow: hidden;
        }
        .admin-sidebar.collapsed .sidebar-footer {
          padding: 12px 0;
          display: flex; flex-direction: column; align-items: center;
        }
        .sidebar-footer-inner {
          padding: 6px 8px; background: #f8f8fb; border-radius: 10px;
          display: flex; align-items: center; gap: 8px;
          transition: padding 0.38s, background 0.38s;
        }
        .admin-sidebar.collapsed .sidebar-footer-inner {
          padding: 4px; background: transparent;
          width: 44px; justify-content: center;
        }
        .sidebar-footer-avatar {
          width: 32px; height: 32px; min-width: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #2D86A8, #006288);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 11px; font-weight: 700; color: white;
          transition: width 0.22s, height 0.22s, border-radius 0.22s;
        }
        .admin-sidebar.collapsed .sidebar-footer-avatar { width: 36px; height: 36px; border-radius: 10px; }
        .sidebar-footer-text {
          flex: 1; overflow: hidden; white-space: nowrap;
          opacity: 1; max-width: 140px;
          transition: opacity 0.24s, max-width 0.38s;
        }
        .admin-sidebar.collapsed .sidebar-footer-text { opacity: 0; max-width: 0; pointer-events: none; }
        .sidebar-footer-text p:first-child { font-size: 10.5px; color: #9e9ea7; margin: 0; line-height: 1.3; }
        .sidebar-footer-text p:last-child  { font-size: 12.5px; font-weight: 600; color: #1C1B1F; margin: 0; line-height: 1.3; }

        .sidebar-logout-btn {
          width: 28px; height: 28px; min-width: 28px;
          border-radius: 8px; border: none; background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          opacity: 1; max-width: 28px;
          transition: background 0.18s, opacity 0.24s, max-width 0.38s, transform 0.18s;
        }
        .admin-sidebar.collapsed .sidebar-logout-btn { opacity: 0; max-width: 0; pointer-events: none; }
        .sidebar-logout-btn .material-symbols-rounded {
          font-size: 18px; color: #9292a0;
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          transition: color 0.18s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        .sidebar-logout-btn:hover { background: rgba(249,0,0,0.08); }
        .sidebar-logout-btn:hover .material-symbols-rounded { color: #F90000; transform: translateX(2px); }
        .sidebar-logout-btn:active { transform: scale(0.92); }

        .sidebar-footer-collapsed-logout { display: none; width: 44px; justify-content: center; margin-top: 6px; }
        .admin-sidebar.collapsed .sidebar-footer-collapsed-logout { display: flex; }
        .sidebar-footer-collapsed-logout button {
          width: 44px; height: 36px; border-radius: 10px; border: none; background: #f8f8fb;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: background 0.18s, transform 0.18s;
        }
        .sidebar-footer-collapsed-logout button:hover { background: rgba(249,0,0,0.08); }
        .sidebar-footer-collapsed-logout button:hover .material-symbols-rounded { color: #F90000; transform: translateX(2px); }
        .sidebar-footer-collapsed-logout button:active { transform: scale(0.92); }
        .sidebar-footer-collapsed-logout button .material-symbols-rounded {
          font-size: 18px; color: #9292a0;
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          transition: color 0.18s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes sidebar-fade-in {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <aside className={`admin-sidebar${collapsed ? ' collapsed' : ''}`}>

        {/* ── Logo / collapse toggle ── */}
        <div
          className="sidebar-logo"
          onClick={() => setCollapsed(c => !c)}
          role="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div className="sidebar-logo-mark">
            <span className="logo-text-iq">iQ</span>
            <div className="logo-chevron">
              <span className="material-symbols-rounded">chevron_left</span>
            </div>
          </div>
          <div className="sidebar-logo-text">
            <h2>iQueue</h2>
            <p>Admin Panel</p>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="sidebar-nav">
          {allSections.map((section, si) => (
            <div key={section.key} className="sidebar-section">
              {si > 0 && <div className="sidebar-divider" />}
              <p className="sidebar-section-label">{section.label}</p>
              <div className="sidebar-btn-group">
                {section.items.map((item, idx) => {
                  const isExport = item.label === 'Export';
                  const isActive = !isExport && activePage === mapLabelToPage(item.label);

                  if (isExport) {
                    return (
                      <div
                        key={item.label}
                        className="sidebar-export-wrapper"
                        ref={exportRef}
                        style={{ animationDelay: `${(si * 4 + idx) * 0.04}s` }}
                      >
                        {/* Trigger */}
                        <button
                          type="button"
                          className={`sidebar-export-trigger${exportOpen ? ' open' : ''}`}
                          onClick={() => setExportOpen((open) => !open)}
                          aria-expanded={exportOpen}
                          aria-haspopup="menu"
                        >
                          <span className="material-symbols-rounded sidebar-btn-icon">
                            {exportOpen ? 'close' : 'download'}
                          </span>
                          <span className="sidebar-btn-label">
                            {exportOpen ? 'Close' : 'Export'}
                          </span>
                          <span className="sidebar-btn-tooltip">Export</span>
                        </button>

                        {/* Downward icon-circle menu */}
                        <div
                          className={`sidebar-export-menu${exportOpen ? ' open' : ''}`}
                          role="menu"
                          aria-label="Export options"
                        >
                          {EXPORT_OPTIONS.map((option) => (
                            <button
                              key={option.key}
                              type="button"
                              className="sidebar-export-item"
                              role="menuitem"
                              onClick={() => handleExportOption(option.key)}
                            >
                              <div className="sidebar-export-item-circle">
                                <span className="material-symbols-rounded sidebar-export-item-icon">
                                  {option.icon}
                                </span>
                              </div>
                              <span className="sidebar-export-item-label">{option.label}</span>
                              <span className="sidebar-export-item-tooltip">{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.label}
                      onClick={() => onPageChange(mapLabelToPage(item.label))}
                      className={`sidebar-btn${isActive ? ' active' : ''}`}
                      style={{ animationDelay: `${(si * 4 + idx) * 0.04}s` }}
                    >
                      <span className="material-symbols-rounded sidebar-btn-icon">{item.icon}</span>
                      <span className="sidebar-btn-label">{item.label}</span>
                      <span className="sidebar-btn-tooltip">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Footer ── */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-inner">
            <div className="sidebar-footer-avatar"><span>AU</span></div>
            <div className="sidebar-footer-text">
              <p>Logged in as</p>
              <p>Admin User</p>
            </div>
            <button
              className="sidebar-logout-btn"
              title="Logout" aria-label="Logout"
              onClick={() => navigate('/')}
            >
              <span className="material-symbols-rounded">logout</span>
            </button>
          </div>
          <div className="sidebar-footer-collapsed-logout">
            <button title="Logout" aria-label="Logout" onClick={() => navigate('/')}>
              <span className="material-symbols-rounded">logout</span>
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
