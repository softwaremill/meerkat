'use strict';
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
        const certManagerCrds = new k8s.yaml.ConfigFile("cert-manager-crds", {
            file: "https://github.com/cert-manager/cert-manager/releases/download/v1.14.4/cert-manager.crds.yaml",
        });
        certManagerHelmChart = new HelmRelease('cert-manager', {
            chartName: 'cert-manager',
            chartVersion: '1.14.5',
            chartNamespace: namespace,
            chartValuesPath: './charts_values/cert_manager_values.yaml',
            chartRepositoryUrl: 'https://charts.jetstack.io'
        },
            { dependsOn: [certManagerCrds] })
    }

    let otelOperatorHelmChart;
    if (config.installOpenTelemetryOperator) {
        otelOperatorHelmChart = new HelmRelease('opentelemetry-operator', {
            chartName: 'opentelemetry-operator',
            chartVersion: '0.58.0',
            chartNamespace: namespace,
            chartValuesPath: './charts_values/opentelemetry_operator_values.yaml',
            chartRepositoryUrl: 'https://open-telemetry.github.io/opentelemetry-helm-charts'
        },
            { dependsOn: [certManagerHelmChart] })
    }

    new k8s.kustomize.Directory("otel-kustomize", {
        directory: "../../",
    },
        { dependsOn: [otelOperatorHelmChart] });

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

    if (config.installTempo) {
        let bucket = new MinioBucket('tempo-traces', namespace, { dependsOn: lokiHelmChart })
        new HelmRelease('tempo', {
            chartName: 'tempo',
            chartVersion: '1.7.2',
            chartNamespace: namespace,
            chartValuesPath: './charts_values/tempo_values.yaml',
            chartRepositoryUrl: 'https://grafana.github.io/helm-charts',
        }, { dependsOn: bucket });
    }

    let mimirHelmChart;

    if (config.installMimir) {
        let bucket = new MinioBucket('mimir-metrics', namespace, { dependsOn: lokiHelmChart });
        new MinioBucket('mimir-ruler', namespace, { dependsOn: lokiHelmChart });
        new MinioBucket('mimir-tsdb', namespace, { dependsOn: lokiHelmChart });
        mimirHelmChart = new HelmRelease("mimir", {
            chartName: "mimir-distributed",
            chartVersion: "5.3.0",
            chartNamespace: namespace,
            chartValuesPath: "./charts_values/mimir_values.yaml",
            chartRepositoryUrl: "https://grafana.github.io/helm-charts"
        }, { dependsOn: bucket });
    }

    if (config.installGrafana) {
        new HelmRelease("grafana", {
            chartName: "grafana",
            chartVersion: "7.3.11",
            chartNamespace: namespace,
            chartValuesPath: "./charts_values/grafana_values.yaml",
            chartRepositoryUrl: "https://grafana.github.io/helm-charts"
        }, { dependsOn: mimirHelmChart });
    }

    new HelmRelease("kube-state-metrics", {
        chartName: "kube-state-metrics",
        chartVersion: "5.19.0",
        chartNamespace: "kube-system",
        chartValuesPath: "./charts_values/kube_state_metrics_values.yaml",
        chartRepositoryUrl: "https://prometheus-community.github.io/helm-charts"
    });
    
    // TODO: further installed chart processing if required

    // return Pulumi outputs
    return {}
}
