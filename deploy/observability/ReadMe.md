## Configuration steps

Inside `observabilty` folder. 

1. `pulumi login --local`
2. `pulumi stack init localstack`
3. `pulumi up`
4. `kubectl patch deployment <your_deployment_name> -n <your_deployment_namespace> -p '{"spec": {"template":{"metadata":{"annotations":{"instrumentation.opentelemetry.io/inject-java":"observability/autoinstrumentation"}}}} }'`
5. To retrieve Grafana admin password run: `kubectl get secret --namespace observability grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo`
