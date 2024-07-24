# Meerkat

Observability Starter Kit for JVM Applications

## Introduction

Meerkat is a ready-to-deploy OpenTelemetry solution for JVM applications, giving you a fully configured observability starting kit with logging, tracing, and metrics in a Kubernetes cluster. Run it locally in a try-me environment.

## Architecture overview

With just a few simple commands, you can set up a [KinD](https://kind.sigs.k8s.io/) (Kubernetes in Docker) cluster and install Meerkat components:

- [OpenTelemetry Operator](https://github.com/open-telemetry/opentelemetry-operator),
- [Grafana](https://grafana.com/),
- data backends that process telemetry data (logs, traces and metrics),
- a demo application
- [MinIO](https://min.io/) buckets which are the object storage for data backends

OpenTelemetry Collector, managed by OpenTelemetry Operator, receives telemetry data from the instrumented demo application and forwards it to data backends: logs to [Loki](https://grafana.com/oss/loki/), traces to [Tempo](https://grafana.com/oss/tempo/) and metrics to [Mimir](https://grafana.com/oss/mimir/). OpenTelemetry Operator injects [auto-instrumentation](https://github.com/open-telemetry/opentelemetry-java-instrumentation) into the demo app, which simplifies the process by automatically collecting and sending telemetry data without manual code modifications. Java Instrumentation captures telemetry data from popular libraries and frameworks. Automatic intrumentation is a great way to start collecting standard metrics. To get specific metrics for your application, implement manual instrumentation.
Once the data reaches Loki, Tempo, and Mimir, Grafana is configured to query these data sources directly. Grafana then visualizes the data in its dashboards, allowing you to explore and analyze the telemetry data.

If you only need the OpenTelemetry configuration and already have other backends installed (other than Loki, Mimir, or Tempo) in Kubernetes cluster, you can use Meerkat partially. Learn more here: [link].

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
