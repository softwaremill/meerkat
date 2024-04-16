# Observability Starter Kit for JVM Applications

## Introduction

This project, initiated within the DevOps inter-project space at SoftwareMill, aims to provide a ready-to-deploy configuration based 
on OpenTelemetry for JVM applications. By providing ready-to-deploy solution we want to accelerate, adding industry-standard observability practices into JVM applications.
The Observability Starter Kit is designed to be easily implemented and extended to meet the specific, observability needs.

**This starter kit is intended for developers and DevOps professionals who wish to implement observability into their JVM-based applications using Kubernetes.
Future plans includes extending compatible platforms apart from Kubernetes, such as AWS ECS.**


### Project Goals

We focus on:

- Ease of Adoption: We offer a ready-to-deploy configuration that lowers the barrier to integrating observability
  features into existing and new projects.
- Enhanced Visibility and Monitoring: Our goal is to facilitate deeper insights into application performance and health of JVM applications.

## Why Observability and OpenTelemetry?

In today's complex software environment, observability plays a crucial role. 
It allows developers not only to see what is happening inside their applications but also to identify bottlenecks, 
optimize processes, and quickly analyze and resolve issues. 

OpenTelemetry, a popular open-source project under the Cloud Native Computing Foundation (CNCF), 
facilitates the collection and processing of telemetry data (logs, metrics, traces) in a standardized way. 
**Our focus on OpenTelemetry is due to its increasing adoption as the de facto standard for application telemetry.**

## What will be included ?

- Configuration files for OpenTelemetry Collector to be used together with OpenTelemetry Operator.
- Instrumentation setups.
- YAML manifests for deployment in Kubernetes environments.
- Localhost try-me environment 
- A step-by-step guide to deploying and extending the configuration.
