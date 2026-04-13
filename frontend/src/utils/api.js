const BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const getOverview     = () => api('/api/cluster/overview');
export const getPods         = (ns = 'all') => api(`/api/pods?namespace=${ns}`);
export const getDeployments  = () => api('/api/deployments');
export const getPipelines    = () => api('/api/pipelines');
export const getAlerts       = () => api('/api/alerts');
export const getNamespaces   = () => api('/api/namespaces');
export const getCpuMetrics   = () => api('/api/metrics/cpu');
export const getMemMetrics   = () => api('/api/metrics/memory');
export const rollbackDeploy  = (name) => api(`/api/deployments/${name}/rollback`, { method: 'POST' });
export const scaleDeploy     = (name, replicas) => api(`/api/deployments/${name}/scale`, { method: 'POST', body: JSON.stringify({ replicas }) });
export const resolveAlert    = (id) => api(`/api/alerts/${id}/resolve`, { method: 'POST' });
