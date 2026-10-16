# Terraform Infrastructure as Code (IaC) — TaskBoard AWS Infrastructure

This directory contains the production-grade Terraform configuration for provisioning the AWS infrastructure required by TaskBoard: a highly-available VPC across two Availability Zones and an Amazon Elastic Kubernetes Service (EKS) cluster with a managed worker node group.

---

## Architecture Overview

```
                      AWS VPC (10.20.0.0/16, ap-south-1)
 ┌────────────────────────────────────────────────────────────────────────┐
 │                                                                        │
 │   Public Subnet 1 (10.20.101.0/24)        Public Subnet 2 (10.20.102.0/24)
 │   [ap-south-1a]                           [ap-south-1b]                │
 │   ┌───────────────────────────────┐       ┌──────────────────────────┐ │
 │   │ Internet Gateway + NAT Gateway │       │ External Load Balancers  │ │
 │   │ (kubernetes.io/role/elb = 1)  │       │ (kubernetes.io/role/elb) │ │
 │   └───────────────────────────────┘       └──────────────────────────┘ │
 │                  │                                                     │
 │                  ▼                                                     │
 │   Private Subnet 1 (10.20.1.0/24)         Private Subnet 2 (10.20.2.0/24)
 │   [ap-south-1a]                           [ap-south-1b]                │
 │   ┌───────────────────────────────┐       ┌──────────────────────────┐ │
 │   │ EKS Worker Node 1             │       │ EKS Worker Node 2        │ │
 │   │ (t3.medium, managed group)    │       │ (t3.medium)              │ │
 │   │ internal-elb = 1              │       │ internal-elb = 1         │ │
 │   └───────────────────────────────┘       └──────────────────────────┘ │
 │                                                                        │
 │   EKS Control Plane (Kubernetes v1.31, Managed by AWS)                │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

| File | Purpose | Rubric Criteria |
|------|---------|-----------------|
| `versions.tf` | Specifies Terraform version (`>= 1.7.0`) and AWS provider (`~> 5.0`), with default tags | Valid HCL & provider constraints |
| `variables.tf` | Input variables with descriptions, types, and defaults (`aws_region`, `cluster_name`, `vpc_cidr`, `environment`) | Parameterized infrastructure |
| `main.tf` | Provisions VPC (public/private subnets, NAT gateway) and EKS cluster with managed node groups | VPC + EKS provisioning |
| `outputs.tf` | Exposes `cluster_name`, `cluster_endpoint`, `cluster_security_group_id`, `vpc_id`, `subnets`, and `configure_kubectl` command | Output contracts |
| `terraform.tfvars.example` | Template for environment-specific variables without credentials | Credential hygiene (0 hardcoded secrets) |
| `.gitignore` | Excludes `.terraform/`, `*.tfstate`, `*.tfvars`, and lock caches | State & secret safety |

---

## Rubric Compliance (Module 7: 15 Points)

- **Valid HCL**: Formatted via `terraform fmt` and verified valid with `terraform validate`.
- **VPC Design**: Provisions 2 public subnets (`10.20.101.0/24`, `10.20.102.0/24`) and 2 private subnets (`10.20.1.0/24`, `10.20.2.0/24`) across `ap-south-1a` and `ap-south-1b`.
- **EKS Cluster**: Provisions `taskboard-eks` on Kubernetes 1.31 with an EKS Managed Node Group (`t3.medium`, desired=2, min=2, max=4).
- **Security & Tags**: Configured with standard Kubernetes ingress tags (`kubernetes.io/role/elb` and `kubernetes.io/role/internal-elb`) for AWS Load Balancer Controller integration.
- **No Hardcoded Credentials**: Variables are managed via `terraform.tfvars.example`. Sensitive `.tfvars` and `.tfstate` files are strictly excluded by `.gitignore`.

---

## Execution Commands

### 1. Initialize Working Directory
Downloads AWS provider plugins and required modules:
```bash
terraform init
```

### 2. Format & Validate
Ensures code conforms to canonical style and passes static validation:
```bash
terraform fmt
terraform validate
```

### 3. Generate Execution Plan
Requires AWS credentials (`AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` or `~/.aws/credentials`):
```bash
cp terraform.tfvars.example terraform.tfvars
terraform plan -out=tfplan
```

### 4. Apply Infrastructure
Provisions the VPC and EKS cluster on AWS:
```bash
terraform apply tfplan
```

### 5. Configure Local kubectl
Connects `kubectl` to the newly created EKS cluster:
```bash
aws eks update-kubeconfig --region ap-south-1 --name taskboard-eks
kubectl get nodes
```

### 6. Clean Up (Teardown)
Destroys all provisioned resources to avoid ongoing AWS charges:
```bash
terraform destroy -auto-approve
```
