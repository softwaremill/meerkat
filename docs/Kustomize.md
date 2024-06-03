# Kustomize installation

If you have a Kubernetes cluster already, you can only install our configuration with Kustomize. Apart from your application already deployed, you will need to [deploy OpenTelemetry Operator](https://opentelemetry.io/docs/kubernetes/operator/).

Once the Operator is up and running, proceed to install our Kustomize configuration by executing `kubectl apply -k .` in the root directory of this repo. This will install autoinstrumentation, roles, cluster roles, role bindings, service account, and Grafana dashboards (as configmaps). 

