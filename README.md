# TaskBoard — DevSecOps Capstone Project

A full-stack project management application demonstrating the complete DevOps lifecycle: from code to a monitored Kubernetes environment.

**Author**: Aadish  
**Course**: DevSecOps Capstone  
**Repository**: [github.com/Aadish2006/devsecops-capstone](https://github.com/Aadish2006/devsecops-capstone)  
**Submission Evidence**: See [screenshots/README.md](screenshots/README.md) for full visual evidence across all 10 modules (M1–M10).  
**Grading Rubric Compliance**: See [SUBMISSION.md](SUBMISSION.md) & [GRADING.md](GRADING.md).

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
| Frontend | React 18, Vite, CSS |
| Backend | Python 3.12, FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL 16 |
| Testing | Pytest (10 test cases) |
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
GET    /              — Service info
GET    /health        — Liveness probe
GET    /ready         — Readiness probe (verifies DB)
GET    /metrics       — Prometheus metrics

GET    /api/tasks         — List all tasks
GET    /api/tasks/{id}    — Get a single task
POST   /api/tasks         — Create a task
PUT    /api/tasks/{id}    — Update a task
DELETE /api/tasks/{id}    — Delete a task
GET    /api/tasks/stats   — Dashboard statistics
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
├── scripts/                  # Load test helpers
├── .github/workflows/        # CI/CD pipeline
└── demo/                     # Presentation video + slides
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
