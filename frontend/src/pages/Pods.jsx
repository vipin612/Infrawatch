import { useState, useEffect } from 'react';
import { getPods, getNamespaces } from '../utils/api';
import { RefreshCw, Search, Box } from 'lucide-react';

function statusClass(s) {
  if (s === 'Running') return 'running';
  if (s === 'Pending') return 'pending';
  if (s === 'CrashLoopBackOff') return 'crashloop';
  if (s === 'Terminating') return 'terminating';
  return 'pending';
}

export default function Pods() {
  const [pods, setPods] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [ns, setNs] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [p, n] = await Promise.all([getPods(ns), getNamespaces()]);
      setPods(p); setNamespaces(n);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { setLoading(true); load(); const t = setInterval(load, 6000); return () => clearInterval(t); }, [ns]);

  const filtered = pods.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.namespace.toLowerCase().includes(search.toLowerCase())
  );

  const counts = { Running: 0, Pending: 0, CrashLoopBackOff: 0 };
  pods.forEach(p => { if (counts[p.status] !== undefined) counts[p.status]++; });

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="badge running" style={{ padding: '6px 12px', fontSize: 12 }}>Running: {counts.Running}</div>
        <div className="badge pending" style={{ padding: '6px 12px', fontSize: 12 }}>Pending: {counts.Pending}</div>
        <div className="badge failed" style={{ padding: '6px 12px', fontSize: 12 }}>CrashLoop: {counts.CrashLoopBackOff}</div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><Box size={16} style={{ color: 'var(--orange-500)' }} /> Pods</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                style={{ paddingLeft: 28, width: 200 }}
                placeholder="Search pods..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select value={ns} onChange={e => setNs(e.target.value)}>
              <option value="all">All namespaces</option>
              {namespaces.map(n => <option key={n.name} value={n.name}>{n.name}</option>)}
            </select>
            <button className="btn btn-outline btn-icon" onClick={load}><RefreshCw size={14} /></button>
          </div>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Namespace</th>
                  <th>Status</th>
                  <th>Ready</th>
                  <th>Restarts</th>
                  <th>Node</th>
                  <th>CPU (cores)</th>
                  <th>Memory (MB)</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(pod => (
                  <tr key={pod.id}>
                    <td className="td-primary mono-sm">{pod.name}</td>
                    <td><span className="badge info">{pod.namespace}</span></td>
                    <td><span className={`badge ${statusClass(pod.status)}`}>{pod.status}</span></td>
                    <td className="mono-sm">{pod.ready}</td>
                    <td>
                      <span style={{ color: pod.restarts > 5 ? 'var(--red)' : pod.restarts > 0 ? 'var(--yellow)' : 'var(--text-muted)', fontWeight: pod.restarts > 5 ? 600 : 400 }}>
                        {pod.restarts}
                      </span>
                    </td>
                    <td className="mono-sm">{pod.node}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="mono-sm">{pod.cpu.toFixed(1)}</span>
                        <div className="progress" style={{ width: 60 }}>
                          <div className="progress-bar orange" style={{ width: `${Math.min(pod.cpu / 4 * 100, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="mono-sm">{pod.memory}</span>
                        <div className="progress" style={{ width: 60 }}>
                          <div className="progress-bar blue" style={{ width: `${Math.min(pod.memory / 1024 * 100, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="mono-sm">{pod.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state"><Box /><div>No pods found</div></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
