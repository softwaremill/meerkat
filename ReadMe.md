# Meerkat

Observability Starter Kit for JVM Applications

## Introduction

This project, initiated within the DevOps OSS space at SoftwareMill, aims to provide a ready-to-deploy configuration based on OpenTelemetry for JVM applications. 

It's made of two parts - Kustomize manifests for Kubernetes and quick start configuration described with Pulumi. If you already have a Kubernetes cluster, look into [deploying OpenTelemetry Operator configuration only](docs/Kustomize.md). If you want a demo, look into [try-me environment instructions](docs/TryMe.md).

**This starter kit is intended for Developers and DevOps professionals who wish to implement observability into their JVM-based applications using Kubernetes.
Future plans include extending the configuration to additional platforms beyond Kubernetes, such as AWS ECS.**

## Q&A

- What does this project do?

Meerkat is an observability bootstrapping aid for your JVM-based project. It deploys data backends for logs, traces, and metrics, along with Grafana dashboards and OpenTelemetry Operator, which is a glue to combine it all together.

- What is OpenTelemetry?

OpenTelemetry is an open-source Cloud Native Computing Foundation (CNCF) incubation project.
OpenTelemetry facilitates the collection and processing of telemetry data (logs, metrics, traces) in a standardized way. 

It's a de facto standard for telemetry data that is being supported by all major observability products and their communities. We're using OpenTelemetry Operator to simplify Collector creation and autoinstrumentation configuration.

- What is an OpenTelemetry Collector?

A Collector in OpenTelemetry ecosystem is an application that serves as a receiver, processor, and an exporter of telemetry data. If you're familiar with any other observability tool, you can appreciate the simplicity of this setup. 

- How does autoinstrumentation work?

In layman terms, we're detecting libraries used by an observed application to determine how to extract telemetry data from it. This doesn't require any kind of code modifying, because it relies on injecting a Java Agent as a sidecar to the application. However, based on the language and framework the application uses, not all data will be available by autoinstrumenting. More details [here](https://github.com/open-telemetry/opentelemetry-java-instrumentation/blob/main/docs/supported-libraries.md).

## Getting started

- [Quick start](docs/TryMe.md)
- [Components overview](docs/Components.md)

## Project Goals

We focus on:

- Ease of Adoption: We offer a ready-to-deploy configuration that lowers the barrier to integrating observability features into existing and new projects.
- Enhanced Visibility and Monitoring: Our goal is to facilitate deeper insights into the performance and health of JVM applications.

## Why Observability and OpenTelemetry?

In today's complex software environments, observability plays a crucial role.
It allows developers not only to see what is happening inside their applications but also to identify bottlenecks,
optimize processes, and quickly analyze and resolve issues.

**We focus on OpenTelemetry because it standardizes software telemetry data. OpenTelemetry offers universal way to collect, process and send telemetry data to multiple vendors.**

## What will be included?

- Configuration files for OpenTelemetry Collector to be used together with OpenTelemetry Operator.
- Instrumentation setups.
- YAML manifests for deployment in Kubernetes environments.
- Localhost try-me environment.
- A step-by-step guide to deploying and extending the configuration.

## Copyright

Copyright (C) 2024 SoftwareMill [https://softwaremill.com](https://softwaremill.com).
