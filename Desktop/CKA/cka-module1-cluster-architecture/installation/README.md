# Cluster Installation

This directory contains installation guides and procedures for Kubernetes clusters.

## Installation Methods

### 1. kind (Kubernetes in Docker)
- **File**: `01-kind-installation.md`
- Local development clusters
- Quick setup for testing
- Multi-node cluster support

### 2. kubeadm
- **File**: `02-kubeadm-installation.md`
- Production-ready cluster installation
- Single control plane setup
- Multi-node cluster setup

### 3. High Availability (HA) Setup
- **File**: `03-ha-installation.md`
- Multiple control plane nodes
- Load balancer configuration
- External etcd cluster (optional)

## Prerequisites

Before installing any cluster, ensure you have:
- Container runtime (Docker, containerd, or CRI-O)
- kubectl installed
- Sufficient system resources
- Network connectivity

## Quick Start

Choose your installation method based on your needs:
- **Development/Testing**: Use kind
- **Production/Learning**: Use kubeadm
- **Production HA**: Use kubeadm with HA setup
