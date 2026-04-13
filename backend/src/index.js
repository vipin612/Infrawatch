const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── Mock Data Generators ───────────────────────────────────────────────────

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

const namespaces = ['default', 'kube-system', 'monitoring', 'production', 'staging'];
const podNames = [
  'api-gateway', 'auth-service', 'user-service', 'payment-service',
  'notification-service', 'frontend', 'redis-cache', 'postgres-db',
  'nginx-ingress', 'prometheus', 'grafana', 'cert-manager'
];
const statuses = ['Running', 'Running', 'Running', 'Running', 'Pending', 'CrashLoopBackOff', 'Terminating'];
const nodeNames = ['node-1', 'node-2', 'node-3'];

let pods = podNames.map((name, i) => ({
  id: `pod-${i}`,
  name: `${name}-${Math.random().toString(36).substr(2, 5)}`,
  namespace: namespaces[i % namespaces.length],
  status: statuses[i % statuses.length],
  restarts: randomBetween(0, 15),
  age: `${randomBetween(1, 72)}h`,
  node: nodeNames[i % nodeNames.length],
  cpu: randomFloat(0.1, 4.0),
  memory: randomBetween(64, 1024),
  image: `${name}:v1.${randomBetween(0, 9)}.${randomBetween(0, 20)}`,
  ready: `1/1`,
  createdAt: new Date(Date.now() - randomBetween(1, 72) * 3600000).toISOString()
}));

let deployments = [
  { name: 'api-gateway', namespace: 'production', desired: 3, ready: 3, available: 3, image: 'api-gateway:v1.4.2', age: '5d', strategy: 'RollingUpdate' },
  { name: 'auth-service', namespace: 'production', desired: 2, ready: 2, available: 2, image: 'auth-service:v2.1.0', age: '3d', strategy: 'RollingUpdate' },
  { name: 'frontend', namespace: 'production', desired: 3, ready: 3, available: 3, image: 'frontend:v3.2.1', age: '1d', strategy: 'RollingUpdate' },
  { name: 'payment-service', namespace: 'production', desired: 2, ready: 1, available: 1, image: 'payment-service:v1.2.0', age: '2d', strategy: 'Recreate' },
  { name: 'redis-cache', namespace: 'default', desired: 1, ready: 1, available: 1, image: 'redis:7.0', age: '10d', strategy: 'RollingUpdate' },
  { name: 'prometheus', namespace: 'monitoring', desired: 1, ready: 1, available: 1, image: 'prom/prometheus:v2.45.0', age: '7d', strategy: 'RollingUpdate' },
];

let pipelineRuns = [
  { id: 1, name: 'Build & Push Image', branch: 'main', commit: 'a3f9b2c', status: 'success', duration: '2m 34s', triggeredBy: 'push', time: '10 mins ago' },
  { id: 2, name: 'Deploy to Production', branch: 'main', commit: 'a3f9b2c', status: 'success', duration: '1m 12s', triggeredBy: 'workflow', time: '10 mins ago' },
  { id: 3, name: 'Run Tests', branch: 'feature/auth', commit: 'b1c2d3e', status: 'failed', duration: '3m 45s', triggeredBy: 'push', time: '1h ago' },
  { id: 4, name: 'Build & Push Image', branch: 'feature/auth', commit: 'b1c2d3e', status: 'cancelled', duration: '0m 45s', triggeredBy: 'push', time: '1h ago' },
  { id: 5, name: 'Deploy to Staging', branch: 'develop', commit: 'c4d5e6f', status: 'success', duration: '1m 55s', triggeredBy: 'schedule', time: '3h ago' },
  { id: 6, name: 'Run Tests', branch: 'develop', commit: 'c4d5e6f', status: 'success', duration: '4m 10s', triggeredBy: 'push', time: '3h ago' },
];

let alerts = [
  { id: 1, severity: 'critical', message: 'Pod payment-service is in CrashLoopBackOff', namespace: 'production', time: '2 mins ago', resolved: false },
  { id: 2, severity: 'warning', message: 'High memory usage on node-2 (87%)', namespace: 'kube-system', time: '15 mins ago', resolved: false },
  { id: 3, severity: 'info', message: 'Deployment frontend scaled to 3 replicas', namespace: 'production', time: '1h ago', resolved: true },
  { id: 4, severity: 'warning', message: 'PersistentVolume claim almost full (92%)', namespace: 'monitoring', time: '2h ago', resolved: false },
  { id: 5, severity: 'info', message: 'Node node-3 joined the cluster', namespace: 'kube-system', time: '5h ago', resolved: true },
];

// ─── Metric History (for charts) ────────────────────────────────────────────
let cpuHistory = Array.from({ length: 20 }, (_, i) => ({
  time: `${20 - i}m ago`,
  value: randomFloat(20, 75)
}));
let memHistory = Array.from({ length: 20 }, (_, i) => ({
  time: `${20 - i}m ago`,
  value: randomFloat(40, 85)
}));

// ─── Routes ─────────────────────────────────────────────────────────────────

// Cluster overview
app.get('/api/cluster/overview', (req, res) => {
  const runningPods = pods.filter(p => p.status === 'Running').length;
  const totalCpu = pods.reduce((sum, p) => sum + p.cpu, 0);
  const totalMem = pods.reduce((sum, p) => sum + p.memory, 0);
  res.json({
    nodes: { total: 3, ready: 3, notReady: 0 },
    pods: { total: pods.length, running: runningPods, pending: pods.filter(p => p.status === 'Pending').length, failed: pods.filter(p => p.status === 'CrashLoopBackOff').length },
    deployments: { total: deployments.length, healthy: deployments.filter(d => d.ready === d.desired).length },
    alerts: { total: alerts.length, critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length, warning: alerts.filter(a => a.severity === 'warning' && !a.resolved).length },
    cpu: { usage: parseFloat((totalCpu / (3 * 8)).toFixed(1) * 100).toFixed(1), total: '24 cores' },
    memory: { usage: parseFloat((totalMem / (3 * 32768)).toFixed(2) * 100).toFixed(1), total: '96 GB' },
    uptime: '12d 4h 32m'
  });
});

// Pods
app.get('/api/pods', (req, res) => {
  const { namespace } = req.query;
  let result = namespace && namespace !== 'all' ? pods.filter(p => p.namespace === namespace) : pods;
  res.json(result);
});

// Deployments
app.get('/api/deployments', (req, res) => {
  res.json(deployments);
});

app.post('/api/deployments/:name/rollback', (req, res) => {
  const dep = deployments.find(d => d.name === req.params.name);
  if (!dep) return res.status(404).json({ error: 'Not found' });
  dep.ready = dep.desired;
  dep.available = dep.desired;
  alerts.unshift({ id: Date.now(), severity: 'info', message: `Rollback triggered for ${dep.name}`, namespace: dep.namespace, time: 'just now', resolved: false });
  res.json({ success: true, message: `Rollback initiated for ${dep.name}` });
});

app.post('/api/deployments/:name/scale', (req, res) => {
  const { replicas } = req.body;
  const dep = deployments.find(d => d.name === req.params.name);
  if (!dep) return res.status(404).json({ error: 'Not found' });
  dep.desired = replicas;
  dep.ready = replicas;
  dep.available = replicas;
  alerts.unshift({ id: Date.now(), severity: 'info', message: `${dep.name} scaled to ${replicas} replicas`, namespace: dep.namespace, time: 'just now', resolved: false });
  res.json({ success: true, message: `Scaled to ${replicas} replicas` });
});

// Pipeline
app.get('/api/pipelines', (req, res) => {
  res.json(pipelineRuns);
});

// Alerts
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

app.post('/api/alerts/:id/resolve', (req, res) => {
  const alert = alerts.find(a => a.id === parseInt(req.params.id));
  if (alert) alert.resolved = true;
  res.json({ success: true });
});

// Metrics (for charts)
app.get('/api/metrics/cpu', (req, res) => {
  cpuHistory.push({ time: 'now', value: randomFloat(20, 75) });
  if (cpuHistory.length > 20) cpuHistory.shift();
  res.json(cpuHistory);
});

app.get('/api/metrics/memory', (req, res) => {
  memHistory.push({ time: 'now', value: randomFloat(40, 85) });
  if (memHistory.length > 20) memHistory.shift();
  res.json(memHistory);
});

app.get('/api/namespaces', (req, res) => {
  res.json(namespaces.map(n => ({ name: n, status: 'Active', pods: pods.filter(p => p.namespace === n).length })));
});

// Live updates - simulate pod changes
setInterval(() => {
  pods = pods.map(pod => ({
    ...pod,
    cpu: randomFloat(0.1, 4.0),
    memory: randomBetween(64, 1024),
    restarts: pod.status === 'CrashLoopBackOff' ? pod.restarts + 1 : pod.restarts
  }));
}, 5000);

app.listen(PORT, () => console.log(`InfraWatch API running on port ${PORT}`));
