import { useState } from 'react';
import './App.css';
import { ToastProvider } from './utils/toast';
import Overview from './pages/Overview';
import Pods from './pages/Pods';
import Deployments from './pages/Deployments';
import Pipelines from './pages/Pipelines';
import Alerts from './pages/Alerts';
import {
  LayoutDashboard, Box, Layers, GitBranch,
  Bell, Settings, HelpCircle, ChevronRight
} from 'lucide-react';

const pages = [
  { id: 'overview',     label: 'Overview',     icon: LayoutDashboard, section: 'Monitor' },
  { id: 'pods',         label: 'Pods',          icon: Box,             section: 'Monitor' },
  { id: 'deployments',  label: 'Deployments',   icon: Layers,          section: 'Monitor' },
  { id: 'pipelines',    label: 'Pipelines',     icon: GitBranch,       section: 'CI/CD' },
  { id: 'alerts',       label: 'Alerts',        icon: Bell,            section: 'CI/CD', badge: true },
];

const pageTitles = {
  overview: 'Cluster Overview',
  pods: 'Pods',
  deployments: 'Deployments',
  pipelines: 'CI/CD Pipelines',
  alerts: 'Alerts & Events',
};

const pageComponents = { overview: Overview, pods: Pods, deployments: Deployments, pipelines: Pipelines, alerts: Alerts };

export default function App() {
  const [active, setActive] = useState('overview');

  const sections = [...new Set(pages.map(p => p.section))];
  const Page = pageComponents[active];

  return (
    <ToastProvider>
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">⬡</div>
            <div>
              <div className="logo-text">InfraWatch</div>
              <div className="logo-sub">K8s Monitor</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {sections.map(section => (
              <div key={section}>
                <div className="nav-section-label">{section}</div>
                {pages.filter(p => p.section === section).map(p => (
                  <button
                    key={p.id}
                    className={`nav-item ${active === p.id ? 'active' : ''}`}
                    onClick={() => setActive(p.id)}
                  >
                    <p.icon className="nav-icon" />
                    {p.label}
                    {p.badge && <span className="nav-badge">2</span>}
                  </button>
                ))}
              </div>
            ))}

            <div className="nav-section-label">Settings</div>
            <button className="nav-item"><Settings className="nav-icon" /> Settings</button>
            <button className="nav-item"><HelpCircle className="nav-icon" /> Documentation</button>
          </nav>

          <div className="sidebar-footer">
            <div className="avatar">DK</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>DevOps Team</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>prod-cluster-1</div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>InfraWatch</span>
              <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="header-title">{pageTitles[active]}</span>
            </div>
            <div className="header-right">
              <div className="status-dot">Cluster healthy</div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Space Mono' }}>
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </header>

          <div className="content">
            <Page />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
