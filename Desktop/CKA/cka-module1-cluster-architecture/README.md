# CKA Module 1: Cluster Architecture, Installation & Configuration

Welcome to the comprehensive learning system for Kubernetes CKA Certification Module 1. This module covers 25% of the CKA exam and focuses on understanding, installing, and configuring Kubernetes clusters.

## 📚 Overview

This learning system provides:
- **Detailed theory documentation** covering all Module 1 topics
- **Hands-on lab exercises** with step-by-step instructions
- **Configuration examples** for all major Kubernetes components
- **Automation scripts** for cluster setup and management
- **Architecture diagrams** for visual learning

## 🎯 Learning Objectives

By completing this module, you will be able to:
- Understand Kubernetes cluster architecture and components
- Install and configure clusters using kind and kubeadm
- Set up highly available (HA) cluster configurations
- Implement Pod Security standards and troubleshoot admission errors
- Configure RBAC (Role-Based Access Control) for secure access
- Work with Custom Resource Definitions (CRDs) and Operators
- Deploy applications using Helm and Kustomize

## 📖 Theory Documentation

1. [Cluster Architecture](theory/01-cluster-architecture.md) - Control plane and worker node components
2. [kind Clusters](theory/02-kind-clusters.md) - Local Kubernetes clusters with Docker
3. [kubeadm Setup](theory/03-kubeadm-setup.md) - Production cluster installation and lifecycle
4. [Pod Security](theory/04-pod-security.md) - Security standards and admission control
5. [RBAC](theory/05-rbac.md) - Role-based access control configuration
6. [CRDs and Operators](theory/06-crds-operators.md) - Extending Kubernetes functionality
7. [Helm and Kustomize](theory/07-helm-kustomize.md) - Application deployment tools

## 🧪 Lab Exercises

1. [Lab 1: Explore Cluster Components](labs/lab01-cluster-components/) - Examine running cluster components
2. [Lab 2: kind Multi-Node Cluster](labs/lab02-kind-setup/) - Create local development clusters
3. [Lab 3: kubeadm Cluster Installation](labs/lab03-kubeadm-cluster/) - Install production-ready clusters
4. [Lab 4: HA Cluster Configuration](labs/lab04-ha-configuration/) - Set up high availability
5. [Lab 5: Pod Security Standards](labs/lab05-pod-security/) - Implement security policies
6. [Lab 6: RBAC Configuration](labs/lab06-rbac-configuration/) - Configure access control
7. [Lab 7: Custom Resource Definitions](labs/lab07-crds/) - Create and manage CRDs
8. [Lab 8: Helm and Kustomize](labs/lab08-helm-kustomize/) - Deploy with package managers

## 🛠️ Prerequisites

### Required Tools
- **Docker** - For running kind clusters
- **kubectl** - Kubernetes command-line tool (v1.28+)
- **kind** - Kubernetes in Docker (v0.20+)
- **kubeadm** - For production cluster setup
- **Helm** - Package manager for Kubernetes (v3.12+)

### System Requirements
- Linux, macOS, or Windows with WSL2
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space
- Internet connection for downloading images

### Installation Commands

**kubectl:**
```bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

**kind:**
```bash
# macOS
brew install kind

# Linux
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

**Helm:**
```bash
# macOS
brew install helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

## 📅 Study Plan

### Week 1: Foundations (8-10 hours)
- Day 1-2: Cluster Architecture theory + Lab 1
- Day 3-4: kind Clusters theory + Lab 2
- Day 5: Review and practice

### Week 2: Installation & Configuration (10-12 hours)
- Day 1-2: kubeadm Setup theory + Lab 3
- Day 3-4: HA Configuration theory + Lab 4
- Day 5: Review and troubleshooting practice

### Week 3: Security & Access Control (8-10 hours)
- Day 1-2: Pod Security theory + Lab 5
- Day 3-4: RBAC theory + Lab 6
- Day 5: Review and practice scenarios

### Week 4: Advanced Topics (8-10 hours)
- Day 1-2: CRDs and Operators theory + Lab 7
- Day 3-4: Helm and Kustomize theory + Lab 8
- Day 5: Final review and exam-style practice

**Total Time Estimate:** 34-42 hours

## 🎓 Exam Tips

1. **Practice kubectl commands** - Speed matters in the exam
2. **Use kubectl explain** - Built-in documentation is allowed
3. **Bookmark official docs** - kubernetes.io is accessible during exam
4. **Time management** - Don't spend too long on one question
5. **Verify your work** - Always check that resources are running correctly
6. **Know the shortcuts** - Use aliases and command completion

### Useful kubectl Aliases
```bash
alias k=kubectl
alias kgp='kubectl get pods'
alias kgs='kubectl get svc'
alias kgn='kubectl get nodes'
alias kdp='kubectl describe pod'
alias kaf='kubectl apply -f'
alias kdf='kubectl delete -f'
```

## 📚 Official Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [CKA Exam Curriculum](https://github.com/cncf/curriculum)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [kind Documentation](https://kind.sigs.k8s.io/)
- [kubeadm Documentation](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)

## 🚀 Getting Started

1. **Verify prerequisites** - Run `scripts/verify-labs.sh` to check your environment
2. **Start with theory** - Read through the cluster architecture documentation
3. **Complete labs in order** - Each lab builds on previous knowledge
4. **Practice regularly** - Hands-on experience is crucial for the exam
5. **Review and repeat** - Revisit challenging topics

## 📁 Directory Structure

```
cka-module1-cluster-architecture/
├── theory/              # Theory documentation for all topics
├── labs/                # Hands-on lab exercises
├── configs/             # Configuration file examples
│   ├── kind/           # kind cluster configurations
│   ├── kubeadm/        # kubeadm configurations
│   ├── rbac/           # RBAC resource examples
│   ├── pod-security/   # Pod Security examples
│   ├── crds/           # Custom Resource Definitions
│   └── kustomize/      # Kustomize configurations
├── scripts/            # Automation and helper scripts
└── diagrams/           # Architecture diagrams
```

## 🤝 Contributing

Found an error or want to improve the content? Contributions are welcome!

## 📝 License

This learning material is provided for educational purposes.

---

**Good luck with your CKA certification journey! 🎉**
