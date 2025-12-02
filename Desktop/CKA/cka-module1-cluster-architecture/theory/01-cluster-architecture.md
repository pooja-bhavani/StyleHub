# Kubernetes Cluster Architecture

[← Back to Main](../README.md) | [Next: kind Clusters →](02-kind-clusters.md)

## Overview

Kubernetes is a distributed system that orchestrates containerized applications across a cluster of machines. Understanding the architecture and components is fundamental for the CKA exam and real-world cluster management.

A Kubernetes cluster consists of two main types of nodes:
- **Control Plane Nodes**: Manage the cluster and make global decisions
- **Worker Nodes**: Run application workloads in containers

## Control Plane Components

The control plane is the brain of the Kubernetes cluster. It maintains the desired state of the cluster and responds to changes.

### kube-apiserver

**Purpose**: The API server is the front-end for the Kubernetes control plane and the central management entity.

**Responsibilities**:
- Exposes the Kubernetes API (REST interface)
- Validates and processes API requests
- Serves as the only component that directly communicates with etcd
- Handles authentication, authorization, and admission control
- Provides the interface for kubectl and other clients

**Key Characteristics**:
- Horizontally scalable (can run multiple instances)
- Stateless (all state stored in etcd)
- Listens on port 6443 (default)

**Example API Request Flow**:
```bash
kubectl create deployment nginx --image=nginx
# 1. kubectl sends HTTP POST to kube-apiserver
# 2. API server authenticates and authorizes the request
# 3. Admission controllers validate the request
# 4. API server writes to etcd
# 5. API server returns response to kubectl
```

**Best Practices**:
- Always secure API server with TLS
- Use RBAC for fine-grained access control
- Enable audit logging for compliance
- Configure appropriate rate limiting

### etcd

**Purpose**: Distributed, reliable key-value store that serves as Kubernetes' backing store for all cluster data.

**Responsibilities**:
- Stores all cluster state and configuration
- Maintains consistency across the cluster
- Provides watch functionality for detecting changes
- Ensures data persistence and reliability

**Key Characteristics**:
- Uses Raft consensus algorithm for distributed consistency
- Stores data in key-value format
- Typically runs on port 2379 (client) and 2380 (peer)
- Critical component - cluster cannot function without it

**Data Stored in etcd**:
- Cluster configuration
- Resource definitions (Pods, Services, Deployments, etc.)
- Secrets and ConfigMaps
- Cluster state and metadata

**Backup and Recovery**:
```bash
# Backup etcd
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify backup
ETCDCTL_API=3 etcdctl snapshot status /backup/etcd-snapshot.db

# Restore etcd (cluster must be stopped first)
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db \
  --data-dir=/var/lib/etcd-restore
```

**Best Practices**:
- Regular automated backups (daily minimum)
- Store backups in secure, off-cluster location
- Test restore procedures regularly
- Use TLS for all etcd communication
- Monitor etcd performance and disk I/O

### kube-scheduler

**Purpose**: Watches for newly created Pods with no assigned node and selects a node for them to run on.

**Responsibilities**:
- Monitors API server for unscheduled Pods
- Evaluates node suitability based on multiple factors
- Assigns Pods to appropriate nodes
- Respects constraints and requirements

**Scheduling Factors**:
- **Resource requirements**: CPU, memory requests and limits
- **Node selectors**: Specific node labels
- **Affinity/Anti-affinity**: Pod and node preferences
- **Taints and tolerations**: Node restrictions
- **Data locality**: Persistent volume locations
- **Custom scheduling policies**: User-defined rules

**Scheduling Process**:
1. **Filtering**: Eliminate nodes that don't meet requirements
2. **Scoring**: Rank remaining nodes based on priorities
3. **Binding**: Assign Pod to highest-scoring node

**Example Node Selection**:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  nodeSelector:
    disktype: ssd
```

**Best Practices**:
- Set resource requests and limits on all Pods
- Use node affinity for workload placement
- Implement pod disruption budgets
- Monitor scheduler performance

### kube-controller-manager

**Purpose**: Runs controller processes that regulate the state of the cluster.

**Responsibilities**:
- Watches cluster state through API server
- Makes changes to move current state toward desired state
- Runs multiple controllers as separate processes (compiled into single binary)

**Key Controllers**:

1. **Node Controller**
   - Monitors node health
   - Responds to node failures
   - Evicts Pods from unhealthy nodes

2. **Replication Controller**
   - Maintains correct number of Pod replicas
   - Creates/deletes Pods to match desired count

3. **Endpoints Controller**
   - Populates Endpoints objects (joins Services and Pods)
   - Updates endpoints when Pods are added/removed

4. **Service Account Controller**
   - Creates default ServiceAccounts for namespaces
   - Manages ServiceAccount tokens

5. **Namespace Controller**
   - Manages namespace lifecycle
   - Cleans up resources when namespace is deleted

6. **Job Controller**
   - Manages Job resources
   - Creates Pods to complete Jobs

7. **Deployment Controller**
   - Manages Deployment resources
   - Handles rolling updates and rollbacks

**Controller Pattern**:
```
┌─────────────────────────────────────┐
│  Watch API Server for Changes      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Compare Current vs Desired State   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Take Action to Reconcile           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Update Status in API Server        │
└─────────────────────────────────────┘
```

**Best Practices**:
- Monitor controller lag and errors
- Understand reconciliation loops
- Set appropriate sync periods

### cloud-controller-manager (Optional)

**Purpose**: Integrates Kubernetes with cloud provider APIs (AWS, GCP, Azure, etc.).

**Responsibilities**:
- Manages cloud-specific control loops
- Abstracts cloud provider implementation details
- Enables cloud-specific features

**Key Controllers**:
- **Node Controller**: Checks cloud provider to determine if node has been deleted
- **Route Controller**: Sets up routes in cloud infrastructure
- **Service Controller**: Creates, updates, and deletes cloud load balancers

**When to Use**:
- Running Kubernetes on cloud platforms
- Need cloud-native load balancers
- Require cloud storage integration

## Worker Node Components

Worker nodes run the actual application workloads. Each worker node contains the components necessary to run Pods and be managed by the control plane.

### kubelet

**Purpose**: Primary node agent that runs on each worker node and ensures containers are running in Pods.

**Responsibilities**:
- Registers node with API server
- Watches API server for Pods assigned to its node
- Ensures containers described in PodSpecs are running and healthy
- Reports node and Pod status back to API server
- Executes liveness and readiness probes
- Mounts volumes as specified in Pod specs

**Key Characteristics**:
- Runs as a system service (not as a Pod)
- Communicates with container runtime via CRI (Container Runtime Interface)
- Listens on port 10250
- Manages Pod lifecycle on the node

**Pod Lifecycle Management**:
```
┌──────────────┐
│ Pod Assigned │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Pull Images      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Create Containers│
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Start Containers │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Monitor Health   │
└──────────────────┘
```

**Checking kubelet Status**:
```bash
# Check kubelet service status
systemctl status kubelet

# View kubelet logs
journalctl -u kubelet -f

# Check kubelet configuration
ps aux | grep kubelet
```

**Best Practices**:
- Keep kubelet version within one minor version of API server
- Monitor kubelet logs for errors
- Configure appropriate resource reservations
- Enable kubelet authentication and authorization

### kube-proxy

**Purpose**: Network proxy that runs on each node and maintains network rules for Pod communication.

**Responsibilities**:
- Implements Kubernetes Service abstraction
- Maintains network rules on nodes
- Performs connection forwarding
- Enables Service discovery and load balancing

**Proxy Modes**:

1. **iptables mode** (default)
   - Uses iptables rules for packet forwarding
   - Lower overhead than userspace mode
   - No built-in load balancing (random selection)

2. **IPVS mode**
   - Uses Linux IPVS (IP Virtual Server)
   - Better performance at scale
   - More load balancing algorithms
   - Requires IPVS kernel modules

3. **userspace mode** (legacy)
   - Proxies connections in userspace
   - Higher overhead
   - Rarely used in modern clusters

**How kube-proxy Works**:
```
Client Pod → Service IP → kube-proxy rules → Backend Pod
```

**Example Service to Pod Mapping**:
```bash
# Service definition
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 8080

# kube-proxy creates iptables rules:
# Service IP:80 → Pod1 IP:8080
# Service IP:80 → Pod2 IP:8080
# Service IP:80 → Pod3 IP:8080
```

**Checking kube-proxy**:
```bash
# View kube-proxy pods
kubectl get pods -n kube-system -l k8s-app=kube-proxy

# Check kube-proxy logs
kubectl logs -n kube-system <kube-proxy-pod>

# View iptables rules (on node)
sudo iptables -t nat -L -n | grep <service-name>
```

**Best Practices**:
- Use IPVS mode for large clusters
- Monitor kube-proxy for errors
- Understand Service types (ClusterIP, NodePort, LoadBalancer)

### Container Runtime

**Purpose**: Software responsible for running containers on the node.

**Responsibilities**:
- Pulls container images from registries
- Unpacks and runs containers
- Manages container lifecycle
- Provides container isolation

**Container Runtime Interface (CRI)**:
- Standard interface between kubelet and container runtime
- Allows pluggable container runtimes
- Defines gRPC API for container and image operations

**Supported Runtimes**:

1. **containerd**
   - Industry-standard container runtime
   - Graduated CNCF project
   - Lightweight and performant
   - Default in many Kubernetes distributions

2. **CRI-O**
   - Lightweight runtime specifically for Kubernetes
   - OCI-compliant
   - Minimal dependencies

3. **Docker Engine** (via cri-dockerd)
   - Requires cri-dockerd adapter
   - Docker support removed from kubelet in v1.24
   - Still widely used with adapter

**Checking Container Runtime**:
```bash
# Check which runtime is configured
kubectl get nodes -o wide

# For containerd
sudo crictl ps
sudo crictl images

# For Docker (with cri-dockerd)
sudo docker ps
```

**Best Practices**:
- Use containerd or CRI-O for new clusters
- Keep runtime updated with security patches
- Configure appropriate storage drivers
- Monitor runtime performance

## Component Communication Flow

Understanding how components interact is crucial for troubleshooting.

### Pod Creation Flow

```
1. User runs: kubectl create -f pod.yaml
   ↓
2. kubectl → API Server (HTTPS)
   ↓
3. API Server validates and writes to etcd
   ↓
4. Scheduler watches API Server, sees unscheduled Pod
   ↓
5. Scheduler selects node, updates Pod binding in API Server
   ↓
6. API Server writes binding to etcd
   ↓
7. kubelet on selected node watches API Server, sees new Pod
   ↓
8. kubelet tells container runtime to pull image and start container
   ↓
9. kubelet reports Pod status back to API Server
   ↓
10. API Server updates Pod status in etcd
```

### Service Request Flow

```
1. Client Pod makes request to Service IP
   ↓
2. kube-proxy iptables/IPVS rules intercept request
   ↓
3. Request forwarded to one of the backend Pods
   ↓
4. Backend Pod processes request and responds
   ↓
5. Response returns to client Pod
```

## Static Pods

**What are Static Pods?**
- Pods managed directly by kubelet on a specific node
- Not managed by API server or controllers
- Defined by manifest files in kubelet's watch directory

**Use Cases**:
- Running control plane components (in kubeadm clusters)
- Node-specific system services

**Static Pod Location**:
```bash
# Default location
/etc/kubernetes/manifests/

# Control plane static pods
ls /etc/kubernetes/manifests/
# kube-apiserver.yaml
# kube-controller-manager.yaml
# kube-scheduler.yaml
# etcd.yaml
```

**Characteristics**:
- Automatically restarted by kubelet if they fail
- Mirror Pods created in API server (read-only)
- Cannot be managed by kubectl (except mirror)

## Cluster Add-ons

Essential add-ons that extend cluster functionality:

### DNS (CoreDNS)

- Provides DNS-based service discovery
- Runs as a Deployment in kube-system namespace
- Automatically configured by kubeadm

### CNI (Container Network Interface) Plugin

- Provides Pod networking
- Examples: Calico, Flannel, Weave, Cilium
- Must be installed for Pod-to-Pod communication

### Metrics Server

- Collects resource metrics from kubelets
- Required for `kubectl top` and HPA (Horizontal Pod Autoscaler)

## Common Pitfalls

1. **etcd not backed up regularly**
   - Always maintain recent backups
   - Test restore procedures

2. **Insufficient resources on control plane**
   - Control plane needs adequate CPU/memory
   - Monitor control plane performance

3. **Version skew between components**
   - Keep components within supported version ranges
   - Upgrade in correct order

4. **Network plugin not installed**
   - Pods remain in Pending state
   - Install CNI plugin after cluster initialization

5. **Firewall blocking required ports**
   - Ensure all required ports are open
   - Check both host firewall and cloud security groups

## Exam Tips

1. **Know component locations**:
   - Control plane: `/etc/kubernetes/manifests/`
   - kubelet config: `/var/lib/kubelet/config.yaml`
   - Certificates: `/etc/kubernetes/pki/`

2. **Understand component flags**:
   ```bash
   ps aux | grep kube-apiserver
   ps aux | grep kubelet
   ```

3. **Check component health**:
   ```bash
   kubectl get componentstatuses  # Deprecated but useful
   kubectl get pods -n kube-system
   ```

4. **Know how to troubleshoot**:
   - Check logs: `journalctl -u kubelet`
   - Check Pod logs: `kubectl logs -n kube-system <pod>`
   - Describe resources: `kubectl describe pod <pod>`

5. **Understand etcd backup/restore**:
   - Practice backup and restore procedures
   - Know the etcdctl commands

## Real-World Use Cases

### Scenario 1: API Server Unavailable
**Problem**: Cannot connect to cluster
**Troubleshooting**:
1. Check API server Pod: `kubectl get pods -n kube-system`
2. Check API server logs: `kubectl logs -n kube-system kube-apiserver-*`
3. Check certificates: `openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text`
4. Check etcd connectivity

### Scenario 2: Pods Not Scheduling
**Problem**: Pods stuck in Pending state
**Troubleshooting**:
1. Check scheduler: `kubectl get pods -n kube-system -l component=kube-scheduler`
2. Check node resources: `kubectl describe nodes`
3. Check Pod events: `kubectl describe pod <pod>`
4. Check taints and tolerations

### Scenario 3: Service Not Accessible
**Problem**: Cannot reach Service
**Troubleshooting**:
1. Check Service endpoints: `kubectl get endpoints <service>`
2. Check kube-proxy: `kubectl get pods -n kube-system -l k8s-app=kube-proxy`
3. Check Pod labels match Service selector
4. Test from within cluster first

## Best Practices Summary

1. **High Availability**:
   - Run multiple control plane nodes (3 or 5)
   - Use external etcd cluster for large deployments
   - Implement load balancer for API servers

2. **Security**:
   - Enable RBAC
   - Use TLS for all component communication
   - Regularly rotate certificates
   - Enable audit logging

3. **Monitoring**:
   - Monitor all component health
   - Set up alerts for component failures
   - Track resource usage

4. **Backup**:
   - Automate etcd backups
   - Store backups securely off-cluster
   - Test restore procedures regularly

5. **Updates**:
   - Keep components updated
   - Follow upgrade best practices
   - Test upgrades in non-production first

## References

- [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/)
- [Cluster Architecture](https://kubernetes.io/docs/concepts/architecture/)
- [etcd Documentation](https://etcd.io/docs/)
- [kubelet Documentation](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/)

---

[← Back to Main](../README.md) | [Next: kind Clusters →](02-kind-clusters.md)
