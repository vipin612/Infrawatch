import { useState, useEffect } from 'react';
import { getDeployments, rollbackDeploy, scaleDeploy } from '../utils/api';
import { useToast } from '../utils/toast';
import { RotateCcw, Layers, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

export default function Deployments() {
  const toast = useToast();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scaling, setScaling] = useState({});
  const [scaleInput, setScaleInput] = useState({});

  const load = async () => {
    try { const d = await getDeployments(); setDeployments(d); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRollback = async (name) => {
    try {
      await rollbackDeploy(name);
      toast(`Rollback initiated for ${name}`, '↩');
      load();
    } catch (e) { toast('Rollback failed', '✗'); }
  };

  const handleScale = async (name) => {
    const replicas = parseInt(scaleInput[name]);
    if (!replicas || replicas < 1 || replicas > 10) { toast('Enter a valid replica count (1–10)', '⚠'); return; }
    setScaling(s => ({ ...s, [name]: true }));
    try {
      await scaleDeploy(name, replicas);
      toast(`${name} scaled to ${replicas} replicas`, '↑');
      load();
    } catch (e) { toast('Scale failed', '✗'); }
    setScaling(s => ({ ...s, [name]: false }));
  };

  const healthy = deployments.filter(d => d.ready === d.desired).length;

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="badge running" style={{ padding: '6px 12px', fontSize: 12 }}>Healthy: {healthy}/{deployments.length}</div>
        <div className="badge failed" style={{ padding: '6px 12px', fontSize: 12 }}>Degraded: {deployments.length - healthy}</div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><Layers size={16} style={{ color: 'var(--orange-500)' }} /> Deployments</span>
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
                  <th>Health</th>
                  <th>Replicas</th>
                  <th>Strategy</th>
                  <th>Image</th>
                  <th>Age</th>
                  <th>Scale To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deployments.map(dep => {
                  const ok = dep.ready === dep.desired;
                  return (
                    <tr key={dep.name}>
                      <td className="td-primary mono-sm">{dep.name}</td>
                      <td><span className="badge info">{dep.namespace}</span></td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: ok ? 'var(--green)' : 'var(--red)', fontSize: 12, fontWeight: 500 }}>
                          {ok ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                          {ok ? 'Healthy' : 'Degraded'}
                        </span>
                      </td>
                      <td>
                        <span className="mono-sm">
                          <span style={{ color: ok ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{dep.ready}</span>
                          /{dep.desired}
                        </span>
                        <div className="progress" style={{ width: 60, marginTop: 4 }}>
                          <div className={`progress-bar ${ok ? 'green' : 'red'}`} style={{ width: `${(dep.ready / dep.desired) * 100}%` }} />
                        </div>
                      </td>
                      <td><span className="badge info" style={{ background: 'var(--orange-100)', color: 'var(--orange-600)' }}>{dep.strategy}</span></td>
                      <td className="mono-sm" style={{ color: 'var(--text-muted)', fontSize: 11 }}>{dep.image}</td>
                      <td className="mono-sm">{dep.age}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <input
                            type="number" min="1" max="10"
                            placeholder={dep.desired}
                            style={{ width: 60, textAlign: 'center' }}
                            value={scaleInput[dep.name] || ''}
                            onChange={e => setScaleInput(s => ({ ...s, [dep.name]: e.target.value }))}
                          />
                          <button
                            className="btn btn-sm btn-outline"
                            disabled={scaling[dep.name]}
                            onClick={() => handleScale(dep.name)}
                          >
                            <TrendingUp size={12} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRollback(dep.name)}
                        >
                          <RotateCcw size={12} /> Rollback
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
