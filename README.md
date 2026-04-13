# ⬡ InfraWatch — Kubernetes Monitoring Dashboard

A production-grade DevOps project featuring real-time Kubernetes cluster monitoring, CI/CD pipeline visibility, deployment management with rollback, and autoscaling — all in a clean orange-themed dashboard UI.

---

## 🖼️ Features

- **Live Cluster Overview** — Node health, pod status, CPU & memory charts
- **Pod Management** — Filter by namespace, search, live CPU/memory bars
- **Deployment Control** — Scale replicas, one-click rollback
- **CI/CD Pipelines** — GitHub Actions run history with status tracking
- **Alerts & Events** — Severity-based alert feed with resolve action
- **Auto-scaling** — Horizontal Pod Autoscaler (HPA) configured
- **IaC** — Full AWS EKS cluster provisioned via Terraform

---

## 🗂️ Project Structure

```
infrawatch/
├── frontend/          # React dashboard (DM Sans + orange theme)
├── backend/           # Express.js API (mock Kubernetes metrics)
├── k8s/               # Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── hpa.yaml
│   └── ingress.yaml
├── terraform/         # AWS EKS infrastructure
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── .github/workflows/ # GitHub Actions CI/CD
│   └── deploy.yml
└── docker-compose.yml # Local development
```

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### Option A — Docker Compose (Recommended)
```bash
# Unzip and enter the project
unzip infrawatch.zip
cd infrawatch

# Start everything
docker compose up --build

# Open in browser
open http://localhost:3000
```

### Option B — Manual (No Docker)
```bash
# Terminal 1: Start backend
cd backend
npm install
npm start
# API runs on http://localhost:3001

# Terminal 2: Start frontend
cd frontend
npm install
npm start
# UI runs on http://localhost:3000
```

---

## ☁️ Deploy to AWS EKS

### Step 1 — Provision Infrastructure with Terraform
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### Step 2 — Configure kubectl
```bash
# Get the command from Terraform output
terraform output kubeconfig_command
# Run it:
aws eks update-kubeconfig --region us-east-1 --name infrawatch-cluster
```

### Step 3 — Build & Push Docker Images
```bash
# Replace with your DockerHub username
export DOCKERHUB_USER=yourusername

docker build -t $DOCKERHUB_USER/infrawatch-backend:latest ./backend
docker build -t $DOCKERHUB_USER/infrawatch-frontend:latest ./frontend

docker push $DOCKERHUB_USER/infrawatch-backend:latest
docker push $DOCKERHUB_USER/infrawatch-frontend:latest
```

### Step 4 — Update Image References
```bash
# In k8s/backend-deployment.yaml and k8s/frontend-deployment.yaml
# Replace YOUR_DOCKERHUB_USERNAME with your actual username
```

### Step 5 — Deploy to Kubernetes
```bash
kubectl apply -f k8s/
kubectl get pods --watch
kubectl get svc infrawatch-frontend  # Get external IP
```

---

## ⚙️ GitHub Actions CI/CD Setup

Add these secrets in your GitHub repo → Settings → Secrets:

| Secret | Value |
|--------|-------|
| `DOCKERHUB_USERNAME` | Your DockerHub username |
| `DOCKERHUB_TOKEN` | DockerHub access token |
| `KUBECONFIG_DATA` | `cat ~/.kube/config \| base64` |

On every push to `main`, the pipeline will:
1. Run tests
2. Build and push Docker images tagged with commit SHA
3. Deploy to your Kubernetes cluster
4. Verify rollout health

---

## 📊 Resume Bullet Points

- Provisioned a production-grade AWS EKS cluster using Terraform with modular IaC across VPC, subnets, and node groups
- Built a 3-stage GitHub Actions CI/CD pipeline (test → build → deploy) with Docker image caching and automatic rollout verification
- Developed a real-time Kubernetes monitoring dashboard in React consuming live metrics via a REST API, with pod filtering, namespace selection, and CPU/memory visualizations
- Implemented Horizontal Pod Autoscaler (HPA) targeting 70% CPU utilization across backend and frontend deployments
- Engineered one-click deployment rollback and live replica scaling from the dashboard UI

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Recharts, Lucide Icons |
| Backend | Node.js, Express |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes (EKS) |
| IaC | Terraform |
| CI/CD | GitHub Actions |
| Cloud | AWS (EKS, ECR, VPC) |
| Fonts | DM Sans + Space Mono |
