# Meerkat

Observability Starter Kit for JVM Applications

## Table of contents

1. [Introduction](#introduction)
1. [Architecture overview](#architecture-overview)
1. [Quickstart](#quickstart)
1. [Why observability?](#why-observability)
1. [Components](#components)
1. [Copyright](#copyright)

## Introduction

Meerkat is a ready-to-deploy OpenTelemetry solution for JVM applications, giving you a fully configured observability starting kit with logging, tracing, and metrics in a Kubernetes cluster. Run it locally in a try-me environment.

Learn more about Meerkat in dedicated blog series on SoftwareMill [blog](https://softwaremill.com/blog/?tag=meerkat).

## Architecture overview

![Meerkat diagram](https://github.com/user-attachments/assets/85886cb1-f9d7-4b68-877a-d7ca58a8a8bd)

With just a few simple commands, you can set up a [KinD](https://kind.sigs.k8s.io/) (Kubernetes in Docker) cluster and install Meerkat components:

- [OpenTelemetry Operator](https://github.com/open-telemetry/opentelemetry-operator),
- [Grafana](https://grafana.com/),
- data backends that process telemetry data (logs, traces and metrics),
- a demo application
- [MinIO](https://min.io/) buckets which are the object storage for data backends

OpenTelemetry Collector, managed by OpenTelemetry Operator, receives telemetry data from the instrumented demo application and forwards it to data backends: logs to [Loki](https://grafana.com/oss/loki/), traces to [Tempo](https://grafana.com/oss/tempo/) and metrics to [Mimir](https://grafana.com/oss/mimir/). OpenTelemetry Operator injects auto-instrumentation into the demo app, which simplifies the process by automatically collecting and sending telemetry data without manual code modifications. [Java Instrumentation](https://github.com/open-telemetry/opentelemetry-java-instrumentation) captures telemetry data from popular libraries and frameworks. Automatic intrumentation is a great way to start collecting standard metrics. To get specific metrics for your application, implement manual instrumentation.
Once the data reaches Loki, Tempo, and Mimir, Grafana is configured to query these data sources directly. Grafana then visualizes the data in its dashboards, allowing you to explore and analyze the telemetry data.

If you only need the OpenTelemetry configuration and already have other backends installed (other than Loki, Mimir, or Tempo) in Kubernetes cluster, you can use Meerkat partially. See the details [here](docs/Kustomize.md).

## Quickstart

For more detailed instuction navigate to articles on SoftwareMill blog:

- [installation part 1](https://softwaremill.com/observability-part-2-build-a-local-try-me-environment/)
- [installation part 2](https://softwaremill.com/observability-part-3-configuring-opentelemetry-components/)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed - standalone Docker or Docker Desktop both work well
- [Pulumi CLI](https://www.pulumi.com/docs/install/)
- [Node.js and npm](https://nodejs.org/en/download/package-manager)

### Installation

First you need to create Kubernetes cluster on your localhost. For that we're running Kind cluster. Clone the Git repository:

```bash
git clone https://github.com/softwaremill/meerkat.git
```

Navigate to the meerkat folder:

```bash
cd meerkat
```

If needed, adjust the Kind configuration by modifying the try-me/kind/kind-config.yaml file. Run the command to install the cluster:

```bash
try-me/kind/cluster_create.sh
```

The `try-me/observability` folder contains Pulumi code to deploy Observability components to the Kubernetes cluster. Components are deployed as [Helm](https://helm.sh/) Charts. Make sure to connect to the correct Kubernetes context. By default, Pulumi will use a local kubeconfig if available. After installing a Kind cluster, it should be your current context.
Inside the `try-me/observability` folder install libraries. Run:

```bash
npm install
```

Initialize new Pulumi stack:

```bash
pulumi stack init localstack --no-select
```

Deploy necessary components:

```bash
pulumi up localstack
```

All components should be running after few minutes. You can check if the demo app is running:

```bash
kubectl get pods -l app=petclinic
```

Patch the deployment with the annotation to start the automatic instrumentation:

```bash
kubectl patch deployment petclinic -n default -p '{"spec": {"template":{"metadata":{"annotations":{"instrumentation.opentelemetry.io/inject-java":"observability/jvm-autoinstrumentation"}}}} }'
```

You can use port-forwarding to access the PetClinic application UI and see how it looks and play with it:

```bash
kubectl port-forward services/petclinic 8888:8080
```

In your web browser enter <http://localhost:8888/> and explore the demo app.

Retrieve password for Grafana:

```bash
kubectl get secret --namespace observability grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

Use port-forwarding to access Grafana:

```bash
kubectl port-forward --namespace observability services/grafana 8000:80
```

Open your web browser and enter <http://localhost:8000/>.
On the sign-in page, enter admin for the username and paste the password you retrieved from the secret.
Explore dashboards and other features in Grafana.

## Why observability?

With observability, you can gain full insight and visibility into your applications and infrastructure. It helps you pinpoint bottlenecks, identify the root causes of failures, optimize processes, and resolve problems in complex environments. Observability helps you manage and improve your systems, ensuring reliability and performance.

## Components

We're using Kustomize to compose a list of manifests we install with one command. These manifests are required by OpenTelemetry Operator and OpenTelemetry Collector. Kustomize is supported by many tools like kubectl, Terraform, Pulumi, FluxCD, ArgoCD etc., which made us choose this tool.

Pulumi, besides installing data backends (more about this later), is also responsible for installing these required manifests in our localhost installation.

We'll now briefly describe components used in Meerkat.

### Pulumi

Pulumi is an infrastructure-as-code tool. By using a general-purpose programming language you can declare what you want to deploy and apply this declaration by running the app.

### Kustomize

Kustomize is a tool that lets you customize configuration and simplifies its deployment. You can use it to create base templates and patches that modify only portions of them that differ between installations. In Meerkat, we use it to a very basic degree - to organize manifests into one kustomization and generate configMaps for Grafana dashboards.

### Grafana

It's our open-source tool of choice for data visualization. Grafana uses telemetry data backends (Loki, Tempo, and Mimir) to create dashboards with graphs and tables. It also allows for easy data searching using LogQL, TraceQL and PromQL.

### Loki

Loki is a data backend for logs. It uses object storage for keeping data long-term. Any S3-compatible buckets can be used for that, in Meerkat we're using MinIO to keep everything hosted locally. Loki is being deployed using simple scalable mode, which allows for scaling out individual pods if necessary.

### Tempo

It's a backend for traces, it also stores data cheaply in object storage. Made by Grafana, it is easy to set up to work with Grafana, Loki, and Mimir. Tempo is being deployed using distributed mode, which allows for scaling every Tempo microservice separately.

### Mimir

Same thing as Loki and Tempo, but for metrics. Mimir is being deployed in distributed mode.

### OpenTelemetry Operator

Operator in Kubernetes ecosystem is an extension which is responsible for easy managing of another application. It utilizes custom resources to describe how the managed application should work and how it should be configured. It's a way to automate processes that can be done by a Kubernetes cluster. We're using OpenTelemetry Operator to automate collector deployment and handle app instrumentation.

### OpenTelemetry Collector

Everything is being powered by OpenTelemetry Collector. It's responsible for collecting, processing and exporting the data to proper data backends. In Meerkat, we deploy it as a daemonset, which allows us to not only receive application data, but also scrape nodes for resource utilization etc.

## Copyright

Copyright (C) 2024 SoftwareMill [https://softwaremill.com](https://softwaremill.com).
