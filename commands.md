kubectl apply -k kubernetes-manifest-files



# To install Kubernetes Dashbord
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```
# To create Token for admin-user in the kubernetes-dashboard
```
kubectl -n kubernetes-dashboard create token admin-user
```
kubectl create namespace monitoring
