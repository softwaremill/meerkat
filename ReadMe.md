# Observability Starter Kit for JVM Applications

## Introduction
This project, initiated within the DevOps inter-project space at SoftwareMill, aims to provide a ready-to-deploy configuration based on OpenTelemetry for JVM applications. 
The Observability Starter Kit is designed to be easily implemented and extended to meet the specific needs of various projects.

## Why Observability and OpenTelemetry?

In today's complex software environment, observability plays a crucial role. 
It allows developers not only to see what is happening inside their applications but also to identify bottlenecks, optimize processes, and quickly analyze and resolve issues. 
OpenTelemetry, a popular open-source project under the Cloud Native Computing Foundation (CNCF), 
facilitates the collection and processing of telemetry data (logs, metrics, traces) in a standardized way. 
**Our focus on OpenTelemetry is due to its increasing adoption as the de facto standard for application telemetry.**

## Project Goals

The primary goal of this project is to promote the DevOps services of SoftwareMill.
We aim to establish ourselves as experts in the field of Observability and OpenTelemetry, especially within JVM applications. 
By providing a starter kit, we offer a foundation that can be expanded in future developments, simplifying the implementation of observability practices in commercial projects.

## What's Included?
The repository includes:

- Configuration files for OpenTelemetry Collector to be used together with OpenTelemetry Operator.
- Instrumentation setups.
- YAML manifests for deployment in Kubernetes environments.
- A step-by-step guide to deploying and extending the configuration.

## Target Audience

This starter kit is intended for developers and DevOps professionals who wish to implement observability into their JVM-based applications using Kubernetes.
