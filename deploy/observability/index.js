'use strict';
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as config from './src/config.js'
import { HelmRelease } from './src/chart_install.js';
import { MinioBucket } from './src/create_bucket.js';

const createNamespace = (name) => {
    return new k8s.core.v1.Namespace(name, {
        metadata: {
            name: name,
        },
    });
}

export default async () => {

    const observabilityNamespace = createNamespace('observability');
    const namespace = observabilityNamespace.metadata.name
    
    let certManagerHelmChart;
    if (config.installCertManager) {
        certManagerHelmChart = new HelmRelease('cert-manager', {
            chartName: 'cert-manager',
            chartVersion: '1.14.4',
            chartNamespace: namespace,
            chartValuesPath: './charts_values/cert_manager_values.yaml',
            chartRepositoryUrl: 'https://charts.jetstack.io'
        })
    }

    let otelOperatorHelmChart;
    if (config.installOpenTelemetryOperator) {
        otelOperatorHelmChart = new HelmRelease('opentelemetry-operator', {
            chartName: 'opentelemetry-operator',
            chartVersion: '0.55.2',
            chartNamespace: namespace,
            chartValuesPath: './charts_values/opentelemetry_operator_values.yaml',
            chartRepositoryUrl: 'https://open-telemetry.github.io/opentelemetry-helm-charts'
        },
        { dependsOn: [certManagerHelmChart]})
    }

    // TODO: invoke helm chart installation. Change passed values
    let prometheusHelmChart;

    if (config.installPrometheus) {
        prometheusHelmChart = new HelmRelease('prometheus', {
            chartName: 'prometheus',
            chartVersion: '14.0.0',
            chartNamespace: namespace,
            chartValuesPath: './charts_values/prometheus_values.yaml',
            chartRepositoryUrl: 'https://prometheus-community.github.io/helm-charts'
        });
    }

    let lokiHelmChart;

    if (config.installLoki) {
        lokiHelmChart = new HelmRelease('loki', {
            chartName: 'loki',
            chartVersion: '6.2.1',
            chartNamespace: namespace,
            chartValuesPath: './charts_values/loki_values.yaml',
            chartRepositoryUrl: 'https://grafana.github.io/helm-charts'
        });
    }

    let tempoHelmChart;
    let bucket;

    if (config.installTempo) {
        bucket = new MinioBucket('tempo-traces', namespace, { dependsOn: lokiHelmChart })
        tempoHelmChart = new HelmRelease('tempo', {
            chartName: 'tempo',
            chartVersion: '1.7.2',
            chartNamespace: namespace,
            chartValuesPath: './charts_values/tempo_values.yaml',
            chartRepositoryUrl: 'https://grafana.github.io/helm-charts',
        }, { dependsOn: bucket });
    }

    //
    // TODO: further installed chart processing if required

    // return Pulumi outputs
    return {}
}
