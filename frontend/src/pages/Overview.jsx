import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getOverview, getCpuMetrics, getMemMetrics, getAlerts, resolveAlert } from '../utils/api';
import { useToast } from '../utils/toast';
import { Activity, Server, Box, AlertTriangle, Clock, CheckCircle, XCircle, Info } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className={`stat-icon ${color}`}><Icon size={20} /></div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

const alertIcon = { critical: XCircle, warning: AlertTriangle, info: Info };

export default function Overview() {
  const toast = useToast();
  const [overview, setOverview] = useState(null);
  const [cpu, setCpu] = useState([]);
  const [mem, setMem] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const load = async () => {
    try {
      const [ov, cpuD, memD, al] = await Promise.all([getOverview(), getCpuMetrics(), getMemMetrics(), getAlerts()]);
      setOverview(ov); setCpu(cpuD); setMem(memD); setAlerts(al);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, []);

  const handleResolve = async (id) => {
    await resolveAlert(id);
    setAlerts(a => a.map(x => x.id === id ? { ...x, resolved: true } : x));
    toast('Alert resolved', '✓');
  };

  if (!overview) return <div className="loader"><div className="spinner" /><span>Loading cluster data...</span></div>;

  const nodes = overview.nodes;
  const pods = overview.pods;

  return (
    <div>
      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard icon={Server} label="Nodes Ready" value={`${nodes.ready}/${nodes.total}`} sub={<><span style={{color:'var(--green)'}}>●</span> All healthy</>} color="green" />
        <StatCard icon={Box} label="Pods Running" value={`${pods.running}/${pods.total}`} sub={`${pods.pending} pending · ${pods.failed} failed`} color="orange" />
        <StatCard icon={Activity} label="CPU Usage" value={`${overview.cpu.usage}%`} sub={overview.cpu.total} color="blue" />
        <StatCard icon={AlertTriangle} label="Active Alerts" value={overview.alerts.critical + overview.alerts.warning} sub={`${overview.alerts.critical} critical · ${overview.alerts.warning} warnings`} color="red" />
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title"><Activity size={16} style={{ color: 'var(--orange-500)' }} /> CPU Usage</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 20 readings</span>
          </div>
          <div className="card-body chart-container">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={cpu} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }} formatter={v => [`${v.toFixed(1)}%`, 'CPU']} />
                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} fill="url(#cpuGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title"><Server size={16} style={{ color: 'var(--blue)' }} /> Memory Usage</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 20 readings</span>
          </div>
          <div className="card-body chart-container">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={mem} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }} formatter={v => [`${v.toFixed(1)}%`, 'Memory']} />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} fill="url(#memGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Nodes + Alerts */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <span className="card-title"><Server size={16} style={{ color: 'var(--orange-500)' }} /> Cluster Nodes</span>
          </div>
          {['node-1', 'node-2', 'node-3'].map((node, i) => (
            <div key={node} className="node-card" style={{ borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div className="node-name">
                <span className="badge running">Ready</span>
                <span className="mono" style={{ fontSize: 13 }}>{node}</span>
              </div>
              <div className="node-metrics">
                <div>
                  <div className="node-metric-row">
                    <span className="node-metric-label">CPU</span>
                    <span className="node-metric-value">{(30 + i * 12 + Math.random() * 10).toFixed(1)}%</span>
                  </div>
                  <div className="progress"><div className="progress-bar orange" style={{ width: `${30 + i * 12}%` }} /></div>
                </div>
                <div>
                  <div className="node-metric-row">
                    <span className="node-metric-label">Memory</span>
                    <span className="node-metric-value">{(45 + i * 8 + Math.random() * 5).toFixed(1)}%</span>
                  </div>
                  <div className="progress"><div className="progress-bar blue" style={{ width: `${45 + i * 8}%` }} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title"><AlertTriangle size={16} style={{ color: 'var(--red)' }} /> Recent Alerts</span>
            <span className="badge" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>{alerts.filter(a => !a.resolved).length} active</span>
          </div>
          {alerts.slice(0, 5).map(alert => {
            const Icon = alertIcon[alert.severity] || Info;
            return (
              <div key={alert.id} className={`alert-item ${alert.resolved ? 'resolved' : ''}`}>
                <div className={`alert-icon ${alert.severity}`}><Icon size={14} /></div>
                <div style={{ flex: 1 }}>
                  <div className="alert-msg">{alert.message}</div>
                  <div className="alert-meta">
                    <span>{alert.namespace}</span>
                    <span><Clock size={10} style={{ display: 'inline' }} /> {alert.time}</span>
                  </div>
                </div>
                {!alert.resolved && (
                  <button className="btn btn-sm btn-outline" onClick={() => handleResolve(alert.id)}>
                    <CheckCircle size={12} /> Resolve
                  </button>
                )}
                {alert.resolved && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Resolved</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
