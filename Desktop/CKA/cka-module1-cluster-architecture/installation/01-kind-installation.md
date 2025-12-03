# kind Installation Guide

[← Back to Installation](README.md)

## Overview

kind (Kubernetes IN Docker) is a tool for running local Kubernetes clusters using Docker container nodes. It's designed for testing Kubernetes itself, but is also excellent for local development and CI/CD pipelines.

## Prerequisites

### System Requirements
- Docker installed and running
- 4GB RAM minimum (8GB recommended)
- 20GB free disk space
- Linux, macOS, or Windows with WSL2

### Install Docker

**macOS:**
```bash
brew install docker
# Or download Docker Desktop from docker.com
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

**Verify Docker:**
```bash
docker --version
docker ps
```

## Installing kind

### macOS
```bash
# Using Homebrew
brew install kind

# Or using curl
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-darwin-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

### Linux
```bash
# For AMD64 / x86_64
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# For ARM64
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-arm64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

### Windows (PowerShell)
```powershell
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/v0.20.0/kind-windows-amd64
Move-Item .\kind-windows-amd64.exe c:\some-dir-in-your-PATH\kind.exe
```

### Verify Installation
```bash
kind --version
# Output: kind version 0.20.0
```

## Installing kubectl

kind requires kubectl to interact with the cluster.

### macOS
```bash
brew install kubectl

# Or using curl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
```

### Linux
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
```

### Verify kubectl
```bash
kubectl version --client
```

## Creating Your First Cluster

### Single Node Cluster

```bash
# Create a cluster with default settings
kind create cluster

# Create a cluster with a custom name
kind create cluster --name my-cluster

# Verify cluster is running
kubectl cluster-info --context kind-my-cluster
kubectl get nodes
```

**Expected Output:**
```
Creating cluster "my-cluster" ...
 ✓ Ensuring node image (kindest/node:v1.34.0) 🖼
 ✓ Preparing nodes 📦  
 ✓ Writing configuration 📜 
 ✓ Starting control-plane 🕹️ 
 ✓ Installing CNI 🔌 
 ✓ Installing StorageClass 💾 
Set kubectl context to "kind-my-cluster"
You can now use your cluster with:

kubectl cluster-info --context kind-my-cluster
```

### Multi-Node Cluster

Create a configuration file for a multi-node cluster:

```bash
cat > kind-multi-node.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker
EOF

# Create the cluster
kind create cluster --name multi-node --config kind-multi-node.yaml
```

### Cluster with Kubernetes v1.34

```bash
# List available node images
# https://hub.docker.com/r/kindest/node/tags

# Create cluster with Kubernetes v1.34
kind create cluster --name k8s-1-34 --image kindest/node:v1.34.0

# Verify version
kubectl version
```

## Advanced Configuration

### Cluster with Port Mapping

Useful for accessing services from your host machine:

```bash
cat > kind-port-mapping.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 30000
    hostPort: 30000
    protocol: TCP
  - containerPort: 30001
    hostPort: 30001
    protocol: TCP
- role: worker
- role: worker
EOF

kind create cluster --name port-mapped --config kind-port-mapping.yaml
```

### Cluster with Ingress Support

```bash
cat > kind-ingress.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
- role: worker
EOF

kind create cluster --name ingress-cluster --config kind-ingress.yaml

# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# Wait for ingress controller to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

### High Availability (HA) Cluster

```bash
cat > kind-ha.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: control-plane
- role: control-plane
- role: worker
- role: worker
- role: worker
EOF

kind create cluster --name ha-cluster --config kind-ha.yaml
```

### Cluster with Custom Networking

```bash
cat > kind-custom-network.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
networking:
  # WARNING: It is _strongly_ recommended that you keep this the default
  # (127.0.0.1) for security reasons. However it is possible to change this.
  apiServerAddress: "127.0.0.1"
  # By default the API server listens on a random open port.
  # You may choose a specific port but probably don't need to in most cases.
  # Using a random port makes it easier to spin up multiple clusters.
  apiServerPort: 6443
  podSubnet: "10.244.0.0/16"
  serviceSubnet: "10.96.0.0/12"
nodes:
- role: control-plane
- role: worker
EOF

kind create cluster --name custom-network --config kind-custom-network.yaml
```

## Managing kind Clusters

### List Clusters
```bash
kind get clusters
```

### Get Cluster Info
```bash
kubectl cluster-info --context kind-my-cluster
```

### Switch Between Clusters
```bash
# List contexts
kubectl config get-contexts

# Switch context
kubectl config use-context kind-my-cluster
```

### Load Docker Images into Cluster

Instead of pulling from a registry, load local images:

```bash
# Build your image
docker build -t my-app:latest .

# Load into kind cluster
kind load docker-image my-app:latest --name my-cluster

# Verify image is loaded
docker exec -it my-cluster-control-plane crictl images | grep my-app
```

### Export Cluster Logs
```bash
kind export logs --name my-cluster ./logs
```

### Delete Cluster
```bash
# Delete specific cluster
kind delete cluster --name my-cluster

# Delete all clusters
kind delete clusters --all
```

## Troubleshooting

### Cluster Creation Fails

**Issue**: Docker not running
```bash
# Check Docker status
docker ps

# Start Docker
# macOS: Start Docker Desktop
# Linux: sudo systemctl start docker
```

**Issue**: Insufficient resources
```bash
# Check Docker resources
docker info | grep -i memory
docker info | grep -i cpus

# Increase Docker resources in Docker Desktop settings
```

### Cannot Connect to Cluster

```bash
# Verify cluster is running
kind get clusters
docker ps

# Check kubeconfig
kubectl config view
kubectl config current-context

# Set correct context
kubectl config use-context kind-my-cluster
```

### Pods Not Starting

```bash
# Check node status
kubectl get nodes

# Check pod status
kubectl get pods -A

# Describe pod for details
kubectl describe pod <pod-name> -n <namespace>

# Check logs
kubectl logs <pod-name> -n <namespace>
```

### Network Issues

```bash
# Check CNI plugin
kubectl get pods -n kube-system | grep kindnet

# Restart CNI if needed
kubectl delete pod -n kube-system -l app=kindnet
```

## Best Practices

1. **Use Configuration Files**: Always use YAML configs for reproducible clusters
2. **Name Your Clusters**: Use meaningful names for easy identification
3. **Clean Up**: Delete clusters when done to free resources
4. **Version Control**: Store kind configs in version control
5. **Resource Limits**: Be mindful of Docker resource limits
6. **Local Registry**: Set up local registry for faster image loading

## Example: Complete Development Setup

```bash
# 1. Create cluster with ingress
cat > dev-cluster.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
  - containerPort: 443
    hostPort: 443
- role: worker
- role: worker
EOF

kind create cluster --name dev --config dev-cluster.yaml

# 2. Install ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# 3. Wait for ingress to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# 4. Verify setup
kubectl get nodes
kubectl get pods -A

echo "Development cluster ready!"
```

## Exam Tips

1. **Not for CKA Exam**: kind is not used in the actual CKA exam
2. **Practice Tool**: Excellent for practicing CKA topics locally
3. **Quick Reset**: Easy to delete and recreate for clean environment
4. **Multi-Node Practice**: Practice multi-node scenarios without VMs

## References

- [kind Official Documentation](https://kind.sigs.k8s.io/)
- [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/)
- [kind Configuration](https://kind.sigs.k8s.io/docs/user/configuration/)
- [kind GitHub Repository](https://github.com/kubernetes-sigs/kind)

---

[← Back to Installation](README.md) | [Next: kubeadm Installation →](02-kubeadm-installation.md)
