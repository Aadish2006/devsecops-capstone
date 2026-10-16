# Video Walkthrough Script & Demo Outline (3 to 5 Minutes)

Use this script while recording your final presentation video (`demo/demo-video.mp4`). Follow the sections in this exact order to satisfy all rubric requirements.

---

## 🎬 Part 1: Presentation Slides (1.5 Minutes)

**What to show**: Open `demo/presentation_slides.html` in your browser.

- **Slide 1 (Title)**:
  > *"Hello, my name is Aadish. Welcome to my presentation for the DevSecOps Capstone Project. Today I'm showcasing TaskBoard, a containerized full-stack project management platform with automated CI/CD, DevSecOps scanning, Terraform infrastructure, Kubernetes orchestration, and full Prometheus observability."*

- **Slide 2 & 3 (Overview & Tech Stack)**:
  > *"The application stack uses React with Vite for the frontend, Python FastAPI with SQLAlchemy and Alembic for the backend REST API, and PostgreSQL for persistent data. The DevOps pipeline is built with GitHub Actions, Docker, Trivy, Terraform on AWS, Kubernetes with Helm, and Prometheus with Grafana."*

- **Slide 4 (Architecture)**:
  > *"Here is the request flow: users connect to an Nginx reverse proxy running as an unprivileged non-root user. Nginx serves the React SPA and proxies API calls to FastAPI, which talks to PostgreSQL. Both containers run with non-root security profiles."*

- **Slide 5 & 6 (CI/CD, Trivy & Terraform)**:
  > *"Our CI/CD pipeline has 5 automated stages. It runs 10 Pytest cases, builds images, runs Trivy vulnerability scans, pushes to Docker Hub and GHCR with commit SHA tags, and deploys to a local Kind Kubernetes cluster. For infrastructure, we have modular Terraform HCL for a multi-AZ AWS VPC and EKS cluster."*

- **Slide 7 & 8 (K8s, Monitoring & Learnings)**:
  > *"Our Kubernetes manifests and Helm chart manage deployments with readiness and liveness probes. The application exports Prometheus metrics on `/metrics` for real-time monitoring. Now, let's jump into the live live walkthrough!"*

---

## 💻 Part 2: Codebase & Tests (1 Minute)

**What to show**: Your IDE (Antigravity / VS Code) and terminal.

1. **Folder Structure**:
   > *"In the repository, we have clean separation of concerns: `backend/`, `frontend/`, `.github/workflows/`, `terraform/`, `helm/`, `k8s/`, and `monitoring/`."*

2. **Run Pytest**:
   In your terminal run:
   ```bash
   cd backend && pytest -v
   ```
   > *"Here you can see all 10 Pytest test cases passing in under one second, covering all CRUD endpoints, statistics, error handling, and validation."*

---

## 🌐 Part 3: Live Application Walkthrough (1 Minute)

**What to show**: Browser at `http://localhost:3000`.

1. Show the loaded dashboard:
   > *"Here is the running application. You can see my personalized workspace: 'Good morning, Aadish', avatar 'AS', and live statistics."*
2. Click **+ New task**, create a task, and submit:
   > *"Creating a task instantly saves to the PostgreSQL database via the FastAPI REST API, updates the task table, and increments the total counter."*
3. Show the Swagger UI at `http://localhost:8000/docs`:
   > *"FastAPI automatically provides interactive Swagger API documentation for all REST endpoints."*

---

## ⚙️ Part 4: CI/CD Pipeline & Registries (1 Minute)

**What to show**: Browser at GitHub Actions (`github.com/Aadish2006/devsecops-capstone/actions`).

1. Show the recent GitHub Actions pipeline run:
   > *"On our GitHub repository, our 5-stage GitHub Actions workflow triggers automatically on push to main. It tests, builds, scans with Trivy, pushes images with SHA tags, and verifies Kubernetes deployment."*
2. Show Docker Hub (`hub.docker.com/u/aadish06`):
   > *"Images are published to Docker Hub under `aadish06/taskboard-backend` and `aadish06/taskboard-frontend`."*

---

## 📊 Part 5: Metrics & Conclusion (30 Seconds)

**What to show**: `http://localhost:8000/metrics`.

1. Open `/metrics`:
   > *"Here is our live `/metrics` endpoint instrumented with Prometheus, tracking HTTP request counts, durations, and system memory."*
2. Wrap up:
   > *"This completes the demonstration of the TaskBoard DevSecOps Capstone Project. All code, Terraform files, Helm charts, and evidence screenshots are documented and available on GitHub. Thank you!"*

---

## 🎥 Recording Tips
- **Resolution**: 1080p (Full HD) recommended.
- **Audio**: Speak clearly and steadily.
- **Duration**: 3 to 5 minutes total.
- **Save Location**: Export as MP4 and save to `demo/demo-video.mp4` in this repo.
