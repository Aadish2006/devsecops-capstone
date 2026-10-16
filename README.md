# OpsDesk — Cloud & IT Helpdesk Management System (DevSecOps Capstone)

An enterprise SaaS-style IT Helpdesk & Incident Response platform demonstrating the complete DevSecOps lifecycle: from code to a monitored Kubernetes environment.

> **Project Domain**: **Helpdesk & Incident Response (OpsDesk)**  
> Developed as a production-grade domain implementation under the Session 21 Final Student Project requirements (Domain: **Helpdesk**). Manages infrastructure outages, security alerts, SLA tracking, and on-call assignments with automated CI/CD and Kubernetes observability.

[![OpsDesk CI/CD](https://github.com/Aadish2006/devsecops-capstone/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Aadish2006/devsecops-capstone/actions/runs/38912722860)
[![Docker Hub Backend](https://img.shields.io/badge/Docker%20Hub-taskboard--backend-blue?logo=docker)](https://hub.docker.com/r/aadish06/taskboard-backend)
[![Docker Hub Frontend](https://img.shields.io/badge/Docker%20Hub-taskboard--frontend-blue?logo=docker)](https://hub.docker.com/r/aadish06/taskboard-frontend)

**Author**: Aadish  
**Course**: DevSecOps Capstone Project  
**Repository**: [github.com/Aadish2006/devsecops-capstone](https://github.com/Aadish2006/devsecops-capstone)  
**Final Submission Dossier**: See [FINAL-SUBMISSION.md](FINAL-SUBMISSION.md) for full visual evidence & rubric verification across all 10 modules (M1–M10).  
**Video Walkthrough**: [demo.mp4](demo.mp4) (Full platform demonstration walkthrough)  
**Presentation Slides**: [presentation.pptx](presentation.pptx) | [presentation.pdf](presentation.pdf)  
**Grading Rubric**: See [GRADING.md](GRADING.md) & [SUBMISSION.md](SUBMISSION.md).

---

## 🎬 Project Demo Video

A comprehensive 5-minute video walkthrough demonstrating the full DevSecOps platform is available directly in the root repository:

- 📹 **Direct Video File**: [demo.mp4](demo.mp4) (41 MB, 1080p web-optimized MP4)
- **Demonstration Highlights**:
  - **Backend API & Testing**: FastAPI endpoints, SQLite test database, and all 11 Pytest test cases passing.
  - **Frontend Interface**: React 18 OpsDesk Helpdesk dashboard, real-time ticket creation, editing, urgency tags, and status updates.
  - **Docker Containers**: Multi-stage, non-root container builds and Docker Compose orchestration.
  - **CI/CD & Security**: GitHub Actions pipeline execution, automated test runs, and Trivy vulnerability scan.
  - **Kubernetes & Cloud Infrastructure**: Helm deployment, Service / Ingress routing, and Prometheus + Grafana observability.

---

## Architecture

```text
Developer
   |
   v
Git / GitHub
   |
   v
GitHub Actions
   |-- pytest (backend tests)
   |-- npm build (frontend)
   |-- Docker build (backend + frontend)
   |-- Trivy security scan
   `-- Push images to GHCR
              |
              v
        Terraform
              |
       AWS VPC + EKS
              |
              v
            Helm
              |
      +-------+--------+
      |                |
   Frontend          Backend
  React+Vite        FastAPI
      |                |
      +------> PostgreSQL
              |
       Prometheus
              |
           Grafana
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, CSS (OpsDesk Incident Portal) |
| Backend | Python 3.12, FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL 16 |
| Testing | Pytest (11 test cases) |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Security | Trivy (container image scanning) |
| Registry | GitHub Container Registry (GHCR) |
| Infrastructure | Terraform (AWS VPC + EKS) |
| Orchestration | Kubernetes, Helm |
| Networking | Ingress (nginx), ClusterIP Services |
| Autoscaling | HPA (CPU-based) |
| Observability | Prometheus + Grafana |

---

## API Endpoints

```text
GET    /                 — Service info ("OpsDesk Helpdesk API")
GET    /health           — Liveness probe
GET    /ready            — Readiness probe (verifies DB)
GET    /metrics          — Prometheus metrics

GET    /api/tickets       — List all incident tickets
GET    /api/tickets/{id}  — Get single ticket details
POST   /api/tickets       — Log a new incident ticket
PUT    /api/tickets/{id}  — Update ticket status / assignee / urgency
DELETE /api/tickets/{id}  — Delete / resolve ticket
GET    /api/tickets/stats — Incident dashboard statistics

# Backward Compatibility:
GET/POST/PUT/DELETE /api/tasks — Fully supported
```

Swagger documentation: `http://localhost:8000/docs`

---

## Local Setup

### Prerequisites

- Docker Desktop / Docker Engine
- Docker Compose

### Run the full stack

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |
| Prometheus Metrics | http://localhost:8000/metrics |

### Stop

```bash
docker compose down        # stop containers
docker compose down -v     # stop + delete database volume
```

### Run backend directly (without Docker)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL='postgresql+psycopg://taskboard:taskboard@localhost:5432/taskboard'
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

---

## Testing

```bash
cd backend
pytest -v
```

The test suite uses an **in-memory SQLite database** — production PostgreSQL is never touched.

**10 test cases** covering:
- Health and root endpoints
- CRUD operations (Create, Read, Update, Delete)
- Task statistics endpoint
- Input validation (empty title rejection)
- 404 error handling

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push to `main`:

```text
┌─────────┐    ┌──────────────────┐    ┌──────────┐
│  TEST   │───>│ BUILD+SCAN+PUSH  │───>│  DEPLOY  │
└─────────┘    └──────────────────┘    └──────────┘
```

### Test Job
- Python 3.12 setup → `pip install` → `pytest -v`
- Node 22 setup → `npm install` → `npm run build`

### Build, Scan & Push Job
- Build Docker images for backend and frontend
- **Trivy** security scan (fails on HIGH/CRITICAL CVEs)
- Push images to **GHCR** with **Git SHA tags**

### Deploy Job
- Creates a Kind cluster
- Deploys using `helm upgrade --install`
- Verifies pods are running

---

## Docker

### Backend Dockerfile
- Base: `python:3.12-slim`
- Runs Alembic migrations on startup
- **Non-root user** (UID 10001)

### Frontend Dockerfile
- **Multi-stage build**: Node 22 (build) → nginx-unprivileged (runtime)
- **Non-root** by default (nginx-unprivileged image)
- Static assets served via Nginx

---

## Security — Trivy

The CI pipeline scans both container images using [Trivy](https://trivy.dev/):

```bash
trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 <image>
```

- Scans for known vulnerabilities (CVEs) in OS packages and application dependencies
- Pipeline **fails** if HIGH or CRITICAL unfixed vulnerabilities are found
- This is one layer in the defense-in-depth strategy (alongside SAST, dependency scanning, and secret scanning)

---

## Terraform — AWS Infrastructure

Located in `terraform/`. Provisions:

- **VPC** with 2 public subnets + 2 private subnets
- **NAT Gateway** for private subnet internet access
- **EKS Cluster** (Kubernetes 1.31) with managed node group (t3.medium, 2-4 nodes)

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

Region: `ap-south-1` (Mumbai)

> ⚠️ Always run `terraform destroy` after evaluation to avoid AWS costs.

---

## Kubernetes + Helm

### Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

### Deploy with Helm

```bash
helm upgrade --install taskboard ./helm/taskboard \
  --namespace taskboard --create-namespace
```

### Helm Chart Components

| Template | Purpose |
|----------|---------|
| `backend-deployment.yaml` | Backend pods with health/readiness probes |
| `frontend-deployment.yaml` | Frontend pods (nginx-unprivileged) |
| `backend-service.yaml` | ClusterIP service for backend |
| `frontend-service.yaml` | ClusterIP service for frontend |
| `postgres.yaml` | PostgreSQL deployment + PVC + Secret |
| `ingress.yaml` | Route `/` → frontend, `/api` → backend |
| `hpa.yaml` | Autoscale backend 2-6 replicas on CPU |
| `servicemonitor.yaml` | Prometheus scrape config |

### Verify

```bash
kubectl get pods -n taskboard
kubectl get svc -n taskboard
kubectl get ingress -n taskboard
kubectl get hpa -n taskboard
helm list -n taskboard
```

---

## Observability — Prometheus + Grafana

### Install kube-prometheus-stack

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -n monitoring --create-namespace \
  -f monitoring/prometheus-values.yaml
```

### How it works

1. Backend exposes `/metrics` (Prometheus format via `prometheus-fastapi-instrumentator`)
2. `ServiceMonitor` tells Prometheus to scrape the backend on port `http` every 15s
3. Grafana visualizes HTTP request rate, latency, error rate, and more

### Access Grafana

```bash
kubectl port-forward svc/kube-prometheus-stack-grafana 3000:80 -n monitoring
# Login: admin / taskboard
```

---

## Repository Structure

```text
devsecops-capstone/
├── demo.mp4                  # Project walkthrough demonstration video (41 MB, 1080p MP4)
├── presentation.pptx         # Presentation slide deck (PowerPoint)
├── presentation.pdf          # Presentation slide deck (PDF export)
├── FINAL-SUBMISSION.md       # Complete 10-module evidence dossier
├── README.md                 # Project documentation & runbook
├── frontend/                 # React + Vite application
│   ├── src/                  # JSX + CSS source
│   ├── Dockerfile            # Multi-stage (Node → nginx-unprivileged)
│   └── nginx.conf            # Reverse proxy config
├── backend/                  # FastAPI application
│   ├── app/                  # Models, schemas, routes, DB config
│   ├── tests/                # 10 Pytest test cases
│   ├── alembic/              # Database migrations
│   ├── Dockerfile            # Python slim + non-root user
│   └── requirements.txt
├── docker-compose.yml        # Full local stack
├── terraform/                # AWS VPC + EKS (HCL)
├── helm/taskboard/           # Helm chart (K8s package)
├── k8s/                      # Namespace + bootstrap manifests
├── monitoring/               # Prometheus + Grafana values
├── troubleshooting/          # Deliberately broken manifests for practice
├── scripts/                  # Load test helpers & slide generators
└── .github/workflows/        # CI/CD pipeline
```

---

## Known Issues & Limitations

- PostgreSQL runs inside the cluster for demo purposes. Production deployments should use a managed service (e.g., Amazon RDS).
- HPA scaling requires Metrics Server to be installed in the cluster.
- The Ingress resource requires an Ingress Controller (e.g., NGINX Ingress Controller) to function.
- Trivy may report vulnerabilities in base images that have no fix available yet — these are excluded via `--ignore-unfixed`.

---

## License

This project is created for educational purposes as part of the DevSecOps Capstone course.
