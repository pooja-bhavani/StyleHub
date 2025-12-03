# kubeadm Installation Guide

[← Back to Installation](README.md)

## Overview

kubeadm is the official tool for bootstrapping production-ready Kubernetes clusters. It performs the necessary actions to get a minimum viable cluster up and running, following best practices.

## Prerequisites

### System Requirements

**Minimum per node:**
- 2 CPUs
- 2GB RAM
- Network connectivity between all machines
- Unique hostname, MAC address, and product_uuid for every node
- Swap disabled

**Recommended:**
- 4 CPUs
- 4GB RAM
- 20GB disk space

### Required Ports

**Control Plane:**
- 6443: Kubernetes API server
- 2379-2380: etcd server client API
- 10250: Kubelet API
- 10259: kube-scheduler
- 10257: kube-controller-manager

**Worker Nodes:**
- 10250: Kubelet API
- 30000-32767: NodePort Services

## Step 1: Prepare All Nodes

Run these steps on **all nodes** (control plane and workers).

### 1.1 Disable Swap

```bash
# Disable swap immediately
sudo swapoff -a

# Disable swap permanently
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# Verify swap is off
free -h
```

### 1.2 Load Required Kernel Modules

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter
```

### 1.3 Configure sysctl Parameters

```bash
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system

# Verify settings
sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
```

### 1.4 Update System

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get upgrade -y

# RHEL/CentOS
sudo yum update -y
```

## Step 2: Install Container Runtime

Choose one container runtime. containerd is recommended.

### Option A: Install containerd (Recommended)

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y containerd

# Configure containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml

# Enable SystemdCgroup
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml

# Restart containerd
sudo systemctl restart containerd
sudo systemctl enable containerd

# Verify containerd is running
sudo systemctl status containerd
```

### Option B: Install CRI-O

```bash
# Ubuntu 22.04
OS=xUbuntu_22.04
VERSION=1.28

echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /" | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
echo "deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /" | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list

curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | sudo apt-key add -
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | sudo apt-key add -

sudo apt-get update
sudo apt-get install -y cri-o cri-o-runc

sudo systemctl start crio
sudo systemctl enable crio
```

## Step 3: Install kubeadm, kubelet, and kubectl

### Ubuntu/Debian

```bash
# Update apt package index and install packages needed to use the Kubernetes apt repository
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

# Download the Google Cloud public signing key
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.34/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

# Add the Kubernetes apt repository
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.34/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

# Update apt package index, install kubelet, kubeadm and kubectl
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl

# Pin their version to prevent automatic updates
sudo apt-mark hold kubelet kubeadm kubectl

# Enable kubelet service
sudo systemctl enable --now kubelet
```

### RHEL/CentOS

```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.34/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.34/rpm/repodata/repomd.xml.key
EOF

sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
sudo systemctl enable --now kubelet
```

### Verify Installation

```bash
kubeadm version
kubelet --version
kubectl version --client
```

## Step 4: Initialize Control Plane

Run these steps **only on the control plane node**.

### 4.1 Initialize the Cluster

```bash
# Basic initialization
sudo kubeadm init

# With custom pod network CIDR (required for some CNI plugins)
sudo kubeadm init --pod-network-cidr=10.244.0.0/16

# With custom API server advertise address
sudo kubeadm init --apiserver-advertise-address=<control-plane-ip> --pod-network-cidr=10.244.0.0/16

# With custom Kubernetes version
sudo kubeadm init --kubernetes-version=v1.34.0 --pod-network-cidr=10.244.0.0/16
```

**Expected Output:**
```
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join <control-plane-ip>:6443 --token <token> \
    --discovery-token-ca-cert-hash sha256:<hash>
```

### 4.2 Configure kubectl for Regular User

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# Verify
kubectl get nodes
kubectl get pods -A
```

### 4.3 Save Join Command

```bash
# The join command is displayed after kubeadm init
# Save it for joining worker nodes later

# If you lost the join command, regenerate it:
kubeadm token create --print-join-command
```

## Step 5: Install CNI Plugin

The cluster needs a Container Network Interface (CNI) plugin for pod networking.

### Option A: Calico (Recommended)

```bash
# Install Calico operator
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/tigera-operator.yaml

# Install Calico custom resources
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/custom-resources.yaml

# Watch pods come up
watch kubectl get pods -n calico-system
```

### Option B: Flannel

```bash
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

# Watch pods come up
watch kubectl get pods -n kube-flannel
```

### Option C: Weave Net

```bash
kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml

# Watch pods come up
watch kubectl get pods -n kube-system
```

### Verify CNI Installation

```bash
# Check all system pods are running
kubectl get pods -A

# Check node status (should be Ready)
kubectl get nodes
```

## Step 6: Join Worker Nodes

Run these steps **on each worker node**.

### 6.1 Join the Cluster

```bash
# Use the join command from Step 4.3
sudo kubeadm join <control-plane-ip>:6443 --token <token> \
    --discovery-token-ca-cert-hash sha256:<hash>
```

**Expected Output:**
```
This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

### 6.2 Verify from Control Plane

```bash
# On control plane node
kubectl get nodes

# Should show all nodes in Ready state
NAME              STATUS   ROLES           AGE   VERSION
control-plane-1   Ready    control-plane   10m   v1.34.0
worker-1          Ready    <none>          2m    v1.34.0
worker-2          Ready    <none>          1m    v1.34.0
```

## Step 7: Verify Cluster

### Check Cluster Components

```bash
# Check nodes
kubectl get nodes -o wide

# Check system pods
kubectl get pods -A

# Check component status
kubectl get --raw='/readyz?verbose'

# Check cluster info
kubectl cluster-info
```

### Deploy Test Application

```bash
# Create a test deployment
kubectl create deployment nginx --image=nginx --replicas=3

# Expose as a service
kubectl expose deployment nginx --port=80 --type=NodePort

# Check deployment
kubectl get deployments
kubectl get pods
kubectl get services

# Test access
curl http://<node-ip>:<node-port>
```

## Common Configuration Options

### Custom kubeadm Configuration File

```yaml
# kubeadm-config.yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
kubernetesVersion: v1.34.0
controlPlaneEndpoint: "control-plane.example.com:6443"
networking:
  podSubnet: "10.244.0.0/16"
  serviceSubnet: "10.96.0.0/12"
apiServer:
  extraArgs:
    authorization-mode: "Node,RBAC"
  certSANs:
  - "control-plane.example.com"
  - "10.0.0.10"
controllerManager:
  extraArgs:
    node-cidr-mask-size: "24"
scheduler:
  extraArgs:
    bind-address: "0.0.0.0"
etcd:
  local:
    dataDir: "/var/lib/etcd"
---
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: "10.0.0.10"
  bindPort: 6443
nodeRegistration:
  criSocket: "unix:///var/run/containerd/containerd.sock"
  kubeletExtraArgs:
    node-labels: "node-role.kubernetes.io/control-plane="
```

**Use the config file:**
```bash
sudo kubeadm init --config kubeadm-config.yaml
```

## Troubleshooting

### kubeadm init Fails

**Check prerequisites:**
```bash
# Verify swap is off
free -h

# Check required ports
sudo netstat -tulpn | grep -E '6443|2379|2380|10250|10259|10257'

# Check container runtime
sudo systemctl status containerd
sudo crictl ps
```

**Reset and try again:**
```bash
sudo kubeadm reset
sudo rm -rf /etc/cni/net.d
sudo rm -rf $HOME/.kube/config
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

### Nodes Not Ready

```bash
# Check node status
kubectl describe node <node-name>

# Check kubelet logs
sudo journalctl -u kubelet -f

# Check CNI plugin
kubectl get pods -n kube-system | grep -E 'calico|flannel|weave'
```

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -A
kubectl describe pod <pod-name> -n <namespace>

# Check logs
kubectl logs <pod-name> -n <namespace>

# Check events
kubectl get events -A --sort-by='.lastTimestamp'
```

### Token Expired

```bash
# Generate new token
kubeadm token create --print-join-command

# List tokens
kubeadm token list
```

## Best Practices

1. **Use Configuration Files**: Store kubeadm configs in version control
2. **Regular Backups**: Backup etcd regularly
3. **Version Pinning**: Pin kubelet, kubeadm, kubectl versions
4. **Security**: Enable RBAC, use network policies
5. **Monitoring**: Set up cluster monitoring from the start
6. **Documentation**: Document your cluster configuration

## Exam Tips

1. **Practice Speed**: kubeadm init takes 5-10 minutes
2. **Know the Commands**: Memorize common kubeadm commands
3. **Troubleshooting**: Practice common failure scenarios
4. **CNI Installation**: Know how to install at least one CNI plugin
5. **Join Command**: Know how to regenerate join tokens

## References

- [kubeadm Official Documentation](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)
- [Installing kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
- [Creating a cluster with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
- [Container Runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)

---

[← Back to Installation](README.md) | [Next: HA Installation →](03-ha-installation.md)
