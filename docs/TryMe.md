# Try-Me Local Environment Setup

## Overview
The `try-me` directory offers scripts and configurations for setting up a local Kubernetes environment using 
[Kind](https://kind.sigs.k8s.io/) and [Pulumi](https://www.pulumi.com/docs/languages-sdks/javascript/),
making testing and development purposes of observability - friendly.

## Prerequisites

- Docker installed - standalone Docker or Docker Desktop both work well
- Pulumi CLI installed

## Running

### 1. [Kind - Kubernetes in Docker](../try-me/kind)

First you need to run Kubernetes cluster on your localhost. For that we're running Kind cluster

- **Configurations**: Adjust your setup by modifying the `kind-config.yml`.
- **Scripts**: 
Utilize

```bash 
pushd ../try-me/kind

./cluster_create.sh

popd
``` 
to set up your Kubernetes cluster and

```bash
pushd ../try-me/kind

./cluster_delete.sh

popd

``` 
to tear it down.


### 2. [Observability](../try-me/observability)

This folder contains Pulumi code to deploy Observability Components into the Kind cluster. 
Components are deployed as Helm Chart managed by Pulumi. Deploying requires couple steps.
[Find out Components deployed](./Components.md)

Inside observability folder.

1. Install libraries. Try-me environment has been prepared using Javascript Pulumi SDK. For those:
```bash

pushd ../try-me/observability
npm install
```

2. Initialize new Pulumi stack:
```bash
pulumi stack init localstack --no-select
```
3. Deploy necessary components:
```bash
pulumi up localstack
```

4. Until now all observability infrastructure are running. We need to auto-instrument the Java application:
```bash
kubectl patch deployment <your_deployment_name> -n <your_deployment_namespace> -p '{"spec": {"template":{"metadata":{"annotations":{"instrumentation.opentelemetry.io/inject-java":"observability/autoinstrumentation"}}}} }'
```
5. Get access to Grafana, to get metrics, logs, traces visualized:
```bash
kubectl get secret --namespace observability grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo # To retrieve Grafana admin password
```



For more details, visit the repository [here](https://github.com/softwaremill/meerkat/tree/main/try-me).
