kubectl apply -k kubernetes-manifest-files



# To install Kubernetes Dashbord
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```
# To create Token for admin-user in the kubernetes-dashboard
```
kubectl -n kubernetes-dashboard create token admin-user
```
# To port-forward Dashbord Service
```
kubectl port-forward svc/kubernetes-dashboard -n kubernetes-dashboard 8080:443 --address=0.0.0.0 &
```
kubectl create namespace monitoring
