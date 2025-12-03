# Cluster Configuration

This directory contains configuration guides for Kubernetes cluster components and features.

## Configuration Topics

### 1. Control Plane Configuration
- **File**: `01-control-plane-config.md`
- API server configuration
- etcd configuration
- Scheduler configuration
- Controller manager configuration

### 2. Worker Node Configuration
- **File**: `02-worker-node-config.md`
- kubelet configuration
- kube-proxy configuration
- Container runtime configuration

### 3. Network Configuration
- **File**: `03-network-config.md`
- CNI plugin installation and configuration
- Service networking
- Pod networking
- Network policies

### 4. Security Configuration
- **File**: `04-security-config.md`
- TLS certificates
- RBAC configuration
- Pod Security Standards
- Admission controllers

### 5. Storage Configuration
- **File**: `05-storage-config.md`
- Persistent volumes
- Storage classes
- Volume plugins

### 6. Add-ons Configuration
- **File**: `06-addons-config.md`
- CoreDNS
- Metrics Server
- Dashboard
- Ingress controllers

## Configuration Files

All configuration examples are stored in the `configs/` directory at the project root.
