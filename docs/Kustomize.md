# Kustomize installation

If you don't need the data backends, Grafana or demo application, you can install only the configuration related to the OpenTelemetry with [Kustomize](https://kustomize.io/#overview) and [Helm](https://helm.sh/). Apart from your application already deployed, you will need to [deploy OpenTelemetry Operator](https://opentelemetry.io/docs/kubernetes/operator/) and [cert-manager](https://cert-manager.io/).

To install cert-manager run:

``` bash
  helm repo add jetstack \ 
  https://charts.jetstack.io --force-update 
```

and

``` bash
helm install \ 
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.15.0 \
  --set crds.enabled=true
```

Install operator:

``` bash
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/latest/download/opentelemetry-operator.yaml
```

Once the Operator is up and running, proceed to install our Kustomize configuration by executing `kubectl apply -k .` in the root directory of this repo. This will install autoinstrumentation, roles, cluster roles, role bindings, service account, and Grafana dashboards (as configmaps).
