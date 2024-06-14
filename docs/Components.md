# Components Overview

## Diagram

TODO: Add diagram https://diagrams.mingrammer.com/

## Components

TODO: add explanation of why this or not other component

- [OTEL Operator](https://github.com/open-telemetry/opentelemetry-operator)
  - [Configuration](../otel)
- [Grafana Loki](https://grafana.com/oss/loki/)
- [Grafana Mimir](https://grafana.com/oss/mimir/)
- [Grafana Tempo](https://grafana.com/oss/tempo/)
- [Prometheus](https://prometheus.io/)

## Petclinic

In order to allow Grafana link logs and traces with each other, we've added a property `logging.pattern.level = trace_id=%mdc{trace_id} span_id=%mdc{span_id} trace_flags=%mdc{trace_flags} %5p` in `src/main/resources/application.properties` file which includes traceid and spanid in logs.
