import { useState, useEffect } from 'react';
import { getPipelines } from '../utils/api';
import { GitBranch, Clock, CheckCircle, XCircle, MinusCircle, Zap } from 'lucide-react';

const statusIcon = { success: CheckCircle, failed: XCircle, cancelled: MinusCircle };
const statusColor = { success: 'var(--green)', failed: 'var(--red)', cancelled: 'var(--gray-400)' };

export default function Pipelines() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPipelines().then(d => { setRuns(d); setLoading(false); }).catch(console.error);
  }, []);

  const total = runs.length;
  const success = runs.filter(r => r.status === 'success').length;
  const rate = total ? Math.round((success / total) * 100) : 0;

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="badge running" style={{ padding: '6px 12px', fontSize: 12 }}>Success rate: {rate}%</div>
        <div className="badge failed" style={{ padding: '6px 12px', fontSize: 12 }}>Failed: {runs.filter(r => r.status === 'failed').length}</div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title"><Zap size={16} style={{ color: 'var(--orange-500)' }} /> GitHub Actions — Pipeline Runs</span>
        </div>
        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <>
            {runs.map(run => {
              const Icon = statusIcon[run.status] || MinusCircle;
              return (
                <div key={run.id} className="pipeline-item">
                  <Icon size={18} style={{ color: statusColor[run.status], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="pipeline-name">{run.name}</div>
                    <div className="pipeline-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <GitBranch size={10} /> {run.branch}
                      </span>
                      <span className="mono-sm">#{run.commit}</span>
                      <span>triggered by {run.triggeredBy}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${run.status}`}>{run.status}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                      <Clock size={10} /> {run.duration}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{run.time}</div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Workflow YAML preview */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <span className="card-title">📄 .github/workflows/deploy.yml</span>
        </div>
        <div className="card-body">
          <pre className="mono" style={{
            fontSize: 12, lineHeight: 1.7, color: 'var(--gray-700)',
            background: 'var(--gray-50)', padding: 16, borderRadius: 8,
            overflowX: 'auto', border: '1px solid var(--border)'
          }}>
{`name: Build, Test & Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm ci && npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & push Docker image
        run: |
          docker build -t \$IMAGE_NAME:\$GITHUB_SHA .
          docker push \$IMAGE_NAME:\$GITHUB_SHA

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/\$APP \\
            \$APP=\$IMAGE_NAME:\$GITHUB_SHA`}
          </pre>
        </div>
      </div>
    </div>
  );
}
