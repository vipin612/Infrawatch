import { useState, useEffect } from 'react';
import { getAlerts, resolveAlert } from '../utils/api';
import { useToast } from '../utils/toast';
import { AlertTriangle, Info, XCircle, CheckCircle, Clock } from 'lucide-react';

const icons = { critical: XCircle, warning: AlertTriangle, info: Info };

export default function Alerts() {
  const toast = useToast();
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlerts().then(d => { setAlerts(d); setLoading(false); }).catch(console.error);
  }, []);

  const handleResolve = async (id) => {
    await resolveAlert(id);
    setAlerts(a => a.map(x => x.id === id ? { ...x, resolved: true } : x));
    toast('Alert marked as resolved', '✓');
  };

  const filtered = alerts.filter(a => {
    if (filter === 'active') return !a.resolved;
    if (filter === 'resolved') return a.resolved;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="badge critical" style={{ padding: '6px 12px', fontSize: 12 }}>Critical: {alerts.filter(a => a.severity === 'critical' && !a.resolved).length}</div>
        <div className="badge warning" style={{ padding: '6px 12px', fontSize: 12 }}>Warning: {alerts.filter(a => a.severity === 'warning' && !a.resolved).length}</div>
        <div className="badge info" style={{ padding: '6px 12px', fontSize: 12 }}>Info: {alerts.filter(a => a.severity === 'info').length}</div>
      </div>

      <div className="tabs">
        {['all', 'active', 'resolved'].map(f => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><AlertTriangle size={16} style={{ color: 'var(--orange-500)' }} /> Alerts</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} total</span>
        </div>
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><AlertTriangle /><div>No alerts</div></div>
        ) : (
          filtered.map(alert => {
            const Icon = icons[alert.severity] || Info;
            return (
              <div key={alert.id} className={`alert-item ${alert.resolved ? 'resolved' : ''}`}>
                <div className={`alert-icon ${alert.severity}`}><Icon size={15} /></div>
                <div style={{ flex: 1 }}>
                  <div className="alert-msg">{alert.message}</div>
                  <div className="alert-meta">
                    <span className={`badge ${alert.severity}`}>{alert.severity}</span>
                    <span>{alert.namespace}</span>
                    <span><Clock size={10} style={{ display: 'inline' }} /> {alert.time}</span>
                  </div>
                </div>
                {!alert.resolved ? (
                  <button className="btn btn-sm btn-outline" onClick={() => handleResolve(alert.id)}>
                    <CheckCircle size={12} /> Resolve
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>✓ Resolved</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
