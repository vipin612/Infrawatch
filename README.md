<div align="center">

```
██╗███╗   ██╗███████╗██████╗  █████╗ ██╗    ██╗ █████╗ ████████╗ ██████╗██╗  ██╗
██║████╗  ██║██╔════╝██╔══██╗██╔══██╗██║    ██║██╔══██╗╚══██╔══╝██╔════╝██║  ██║
██║██╔██╗ ██║█████╗  ██████╔╝███████║██║ █╗ ██║███████║   ██║   ██║     ███████║
██║██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║██║███╗██║██╔══██║   ██║   ██║     ██╔══██║
██║██║ ╚████║██║     ██║  ██║██║  ██║╚███╔███╔╝██║  ██║   ██║   ╚██████╗██║  ██║
╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝
```

### 🟠 Production-Grade Kubernetes Monitoring Dashboard

[![CI/CD](https://img.shields.io/github/actions/workflow/status/YOUR_GITHUB_USERNAME/infrawatch/deploy.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white&label=CI%2FCD&color=ff6b35)](https://github.com/YOUR_GITHUB_USERNAME/infrawatch/actions)
[![Docker](https://img.shields.io/badge/Docker-Hub-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/u/YOUR_DOCKERHUB_USERNAME)
[![Render](https://img.shields.io/badge/Deployed-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://infrawatch-frontend.onrender.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

> **Real-time Kubernetes monitoring** · **CI/CD pipeline visibility** · **One-click rollback** · **Auto-scaling**

<br/>

[🚀 Live Demo](https://infrawatch-frontend.onrender.com) · [📖 Docs](#-table-of-contents) · [🐛 Report Bug](https://github.com/YOUR_GITHUB_USERNAME/infrawatch/issues) · [💡 Request Feature](https://github.com/YOUR_GITHUB_USERNAME/infrawatch/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🖥️ Screenshots](#️-screenshots)
- [🗂️ Project Structure](#️-project-structure)
- [⚡ Quick Start (Local)](#-quick-start-local)
- [🐳 Docker Setup](#-docker-setup)
- [☁️ Deploy to Render (Free — No Card Needed)](#️-deploy-to-render-free--no-card-needed)
- [⚙️ GitHub Actions CI/CD Setup](#️-github-actions-cicd-setup)
- [🔐 GitHub Secrets Reference](#-github-secrets-reference)
- [🛠️ Tech Stack](#️-tech-stack)
- [📊 Resume Bullet Points](#-resume-bullet-points)
- [❓ Troubleshooting](#-troubleshooting)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📡 **Live Cluster Overview** | Node health, pod status, CPU & memory charts in real time |
| 🫛 **Pod Management** | Filter by namespace, search pods, live CPU/memory bars |
| 🚀 **Deployment Control** | Scale replicas and one-click rollback from the UI |
| 🔄 **CI/CD Pipelines** | GitHub Actions run history with live status tracking |
| 🔔 **Alerts & Events** | Severity-based alert feed with resolve action |
| 📈 **Auto-scaling** | Horizontal Pod Autoscaler (HPA) configured at 70% CPU |
| 🏗️ **IaC Ready** | Full AWS EKS cluster provisionable via Terraform |

---

## 🖥️ Screenshots

> Dashboard running locally via Docker Compose

```
┌─────────────────────────────────────────────────────────────┐
│  ⬡ InfraWatch          Cluster: production    🟢 Healthy   │
├──────────────┬──────────────┬──────────────┬───────────────┤
│  Nodes: 3    │  Pods: 24    │  CPU: 42%    │  Memory: 61%  │
├──────────────┴──────────────┴──────────────┴───────────────┤
│  📊 CPU Usage (7d)          │  🫛 Pod Status               │
│  ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆     │  ● Running    18             │
│                             │  ● Pending     4             │
│                             │  ● Failed      2             │
└─────────────────────────────┴──────────────────────────────┘
```

---

## 🗂️ Project Structure

```
infrawatch/
├── 🎨 frontend/                  # React dashboard (DM Sans + orange theme)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── ⚙️  backend/                   # Express.js API (mock Kubernetes metrics)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── ☸️  k8s/                       # Kubernetes manifests
│   ├── backend-deployment.yaml   # ⚠️ Must contain YOUR_DOCKERHUB_USERNAME placeholder
│   ├── frontend-deployment.yaml  # ⚠️ Must contain YOUR_DOCKERHUB_USERNAME placeholder
│   ├── hpa.yaml
│   └── ingress.yaml
├── 🏗️  terraform/                 # AWS EKS infrastructure (optional)
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── 🔄 .github/workflows/
│   └── deploy.yml                # 3-stage CI/CD pipeline
└── 🐳 docker-compose.yml         # Local development
```

---

## ⚡ Quick Start (Local)

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### Option A — Docker Compose ✅ Recommended

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_GITHUB_USERNAME/infrawatch.git
cd infrawatch

# 2. Start everything
docker compose up --build

# 3. Open in browser
# Frontend → http://localhost:3000
# Backend API → http://localhost:3001
```

### Option B — Manual (No Docker)

```bash
# Terminal 1 — Backend
cd backend
npm install
npm start
# → http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm install
npm start
# → http://localhost:3000
```

---

## 🐳 Docker Setup

### Build images manually

```bash
# Set your DockerHub username
export DOCKERHUB_USER=yourusername   # Windows: $env:DOCKERHUB_USER="yourusername"

# Build
docker build -t $DOCKERHUB_USER/infrawatch-backend:latest ./backend
docker build -t $DOCKERHUB_USER/infrawatch-frontend:latest ./frontend

# Push
docker push $DOCKERHUB_USER/infrawatch-backend:latest
docker push $DOCKERHUB_USER/infrawatch-frontend:latest
```

### ⚠️ Important — K8s manifest placeholder
Both `k8s/backend-deployment.yaml` and `k8s/frontend-deployment.yaml` must have this exact placeholder for CI/CD to work:

```yaml
# k8s/backend-deployment.yaml
image: YOUR_DOCKERHUB_USERNAME/infrawatch-backend:latest

# k8s/frontend-deployment.yaml
image: YOUR_DOCKERHUB_USERNAME/infrawatch-frontend:latest
```

Do **not** hardcode your actual username — the GitHub Actions pipeline replaces this automatically at deploy time.

---

## ☁️ Deploy to Render (Free — No Card Needed)

Render is the easiest way to get InfraWatch live on a public URL for free. No credit card required.

### Step 1 — Create a Render Account
1. Go to [render.com](https://render.com)
2. Click **Sign Up** → **Continue with GitHub**
3. Authorize Render to access your GitHub account

### Step 2 — Deploy the Backend

1. In Render dashboard click **New +** → **Web Service**
2. Select **Build and deploy from a Git repository** → connect your GitHub
3. Find and select your **infrawatch** repo → click **Connect**
4. Fill in these settings:

| Setting | Value |
|---|---|
| Name | `infrawatch-backend` |
| Root Directory | `backend` |
| Environment | `Docker` |
| Branch | `main` |
| Instance Type | `Free` |

5. Click **Create Web Service**
6. Wait for the build to finish (2–3 minutes)
7. Copy your backend URL — looks like: `https://infrawatch-backend.onrender.com`

### Step 3 — Deploy the Frontend

1. Click **New +** → **Web Service** again
2. Select the same **infrawatch** repo
3. Fill in these settings:

| Setting | Value |
|---|---|
| Name | `infrawatch-frontend` |
| Root Directory | `frontend` |
| Environment | `Docker` |
| Branch | `main` |
| Instance Type | `Free` |

4. Under **Environment Variables**, add:

| Key | Value |
|---|---|
| `REACT_APP_API_URL` | `https://infrawatch-backend.onrender.com` |

5. Click **Create Web Service**
6. Once deployed, your frontend URL is live: `https://infrawatch-frontend.onrender.com`

### Step 4 — Auto-Deploy on Push (Optional)

By default, Render auto-deploys when you push to `main`. To disable this go to your service → **Settings** → toggle off **Auto-Deploy**.

> 💡 **Free tier note:** Services spin down after 15 minutes of inactivity and take ~30 seconds to wake up on the next request. This is normal — upgrade to the $7/mo Starter plan to keep it always-on.

---

## ⚙️ GitHub Actions CI/CD Setup

The pipeline has 3 stages: **Test → Build → Deploy**

```
Push to main/develop
        │
        ▼
┌───────────────┐
│   Run Tests   │  ← runs on all pushes + PRs
└───────┬───────┘
        │ (on push only)
        ▼
┌───────────────────────┐
│  Build & Push Docker  │  ← pushes :latest + :<commit-sha> to DockerHub
│  images to DockerHub  │
└───────────┬───────────┘
            │ (main branch only)
            ▼
    ┌───────────────┐
    │    Deploy     │  ← deploys to Minikube runner (K8s smoke test)
    └───────────────┘
```

### Step 1 — DockerHub Token

1. Go to [hub.docker.com](https://hub.docker.com) → avatar → **Account Settings**
2. **Personal access tokens** → **Generate new token**
3. Set permissions to **Read, Write, Delete** ← ⚠️ must be this, not Read-only
4. Copy the token

### Step 2 — Add GitHub Secrets

Go to your repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add all three:

| Secret Name | Value |
|---|---|
| `SECRET` | Your DockerHub **username** (e.g. `vipin612`) |
| `DOCKERSECRET` | Your DockerHub **access token** (with Read/Write/Delete scope) |

> ⚠️ Make sure `SECRET` contains only your username — no spaces, quotes, or newlines.

### Step 3 — Verify K8s Manifests Have Placeholder

As mentioned above, your K8s YAML files must use `YOUR_DOCKERHUB_USERNAME` as the image name — not your actual username. The `sed` command in the workflow replaces it at deploy time.

### Complete Workflow File

Save this as `.github/workflows/deploy.yml`:

```yaml
name: Build, Test & Deploy InfraWatch

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install backend deps
        run: cd backend && npm install

      - name: Run backend tests
        run: cd backend && npm test --if-present

  build:
    name: Build & Push Images
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.SECRET }}
          password: ${{ secrets.DOCKERSECRET }}

      - name: Build & push backend image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            ${{ secrets.SECRET }}/infrawatch-backend:${{ github.sha }}
            ${{ secrets.SECRET }}/infrawatch-backend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build & push frontend image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            ${{ secrets.SECRET }}/infrawatch-frontend:${{ github.sha }}
            ${{ secrets.SECRET }}/infrawatch-frontend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    name: Deploy to Kubernetes
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Start Minikube
        uses: medyagh/setup-minikube@master
        with:
          minikube-version: 'latest'
          driver: docker

      - name: Verify cluster connection
        run: kubectl cluster-info

      - name: Update image tags in K8s manifests
        run: |
          sed -i "s|YOUR_DOCKERHUB_USERNAME/infrawatch-backend:latest|${{ secrets.SECRET }}/infrawatch-backend:${{ github.sha }}|g" k8s/backend-deployment.yaml
          sed -i "s|YOUR_DOCKERHUB_USERNAME/infrawatch-frontend:latest|${{ secrets.SECRET }}/infrawatch-frontend:${{ github.sha }}|g" k8s/frontend-deployment.yaml

      - name: Verify sed replacements worked
        run: |
          echo "=== Backend image ==="
          grep "image:" k8s/backend-deployment.yaml
          echo "=== Frontend image ==="
          grep "image:" k8s/frontend-deployment.yaml

      - name: Deploy all manifests to Kubernetes
        run: |
          kubectl apply -f k8s/backend-deployment.yaml
          kubectl apply -f k8s/frontend-deployment.yaml
          kubectl apply -f k8s/hpa.yaml
          kubectl apply -f k8s/ingress.yaml

      - name: Wait for rollout to complete
        run: |
          kubectl rollout status deployment/infrawatch-backend --timeout=300s
          kubectl rollout status deployment/infrawatch-frontend --timeout=300s

      - name: Deployment summary
        run: |
          echo "========================================="
          echo "Deployment complete!"
          echo "Backend : ${{ secrets.SECRET }}/infrawatch-backend:${{ github.sha }}"
          echo "Frontend: ${{ secrets.SECRET }}/infrawatch-frontend:${{ github.sha }}"
          echo "========================================="
          kubectl get pods
          kubectl get svc
```

---

## 🔐 GitHub Secrets Reference

| Secret | Where to get it | Notes |
|---|---|---|
| `SECRET` | Your DockerHub profile page | Username only, no spaces |
| `DOCKERSECRET` | DockerHub → Account Settings → Tokens | Must have **Read, Write, Delete** scope |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| 🎨 Frontend | React 18, Recharts, Lucide Icons |
| ⚙️ Backend | Node.js, Express |
| 🐳 Containerization | Docker, Docker Compose |
| ☸️ Orchestration | Kubernetes + HPA |
| 🏗️ IaC | Terraform (AWS EKS) |
| 🔄 CI/CD | GitHub Actions (3-stage pipeline) |
| ☁️ Hosting | Render (free tier) |
| 📦 Registry | DockerHub |
| 🔤 Fonts | DM Sans + Space Mono |

---

## 📊 Resume Bullet Points

Copy-paste ready for your resume:

- Provisioned a production-grade AWS EKS cluster using Terraform with modular IaC across VPC, subnets, and node groups
- Built a 3-stage GitHub Actions CI/CD pipeline (test → build → deploy) with Docker image caching, commit-SHA tagging, and automatic rollout verification
- Developed a real-time Kubernetes monitoring dashboard in React consuming live metrics via a REST API, with pod filtering, namespace selection, and CPU/memory visualizations
- Implemented Horizontal Pod Autoscaler (HPA) targeting 70% CPU utilization across backend and frontend deployments
- Engineered one-click deployment rollback and live replica scaling from the dashboard UI
- Deployed containerized microservices to Render with automated GitHub Actions integration for zero-downtime continuous delivery

---

## ❓ Troubleshooting

### ❌ `invalid tag "/infrawatch-backend:..."` (image name missing username)

**Cause:** The `SECRET` GitHub secret is empty or not set correctly.

**Fix:**
1. Go to repo → Settings → Secrets → Actions
2. Check that `SECRET` exists and contains your DockerHub username (e.g. `vipin612`)
3. No quotes, no spaces, no newlines — just the plain username

---

### ❌ `401 Unauthorized: access token has insufficient scopes`

**Cause:** Your DockerHub token only has Read access.

**Fix:**
1. Go to hub.docker.com → Account Settings → Personal access tokens
2. Delete the old token
3. Create a new one with **Read, Write, Delete** permissions
4. Update `DOCKERSECRET` in GitHub secrets

---

### ❌ `base64: invalid input` (kubeconfig error)

**Cause:** The kubeconfig stored in the secret is raw YAML, not base64 encoded.

**Fix (Windows PowerShell):**
```powershell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("$env:USERPROFILE\.kube\config"))
```
Copy the output and update your `KUBECONFIGSECRET` GitHub secret.

> Note: If using Minikube locally, this won't work from GitHub Actions — see the workflow above which uses `medyagh/setup-minikube@master` to spin up a fresh cluster on the runner instead.

---

### ❌ `sed` replacement didn't work — wrong image deployed

**Cause:** The K8s manifest already has a hardcoded username instead of the placeholder.

**Fix:** Open `k8s/backend-deployment.yaml` and `k8s/frontend-deployment.yaml` and make sure the image line is exactly:
```yaml
image: YOUR_DOCKERHUB_USERNAME/infrawatch-backend:latest
```

---

### ❌ Render service shows old version after push

**Fix:** Go to Render dashboard → your service → **Manual Deploy** → **Deploy latest commit**. Also check that Auto-Deploy is enabled in Settings.

---

### ❌ Render app takes 30+ seconds to load

**Cause:** Free tier spins down after 15 min of inactivity.

**Fix:** This is expected on the free tier. Upgrade to Starter ($7/mo) for always-on, or add a cron job to ping your service every 10 minutes to keep it warm.

---

<div align="center">

Made with 🟠 by Vipin Sharma(https://github.com/YOUR_GITHUB_USERNAME)

⭐ Star this repo if it helped you!

</div>
