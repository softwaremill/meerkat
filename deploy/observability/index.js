'use strict';
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as config from './src/config.js'
import { installHelmRelease } from './src/chart_install.js';
import { createBucket } from './src/create_bucket.js';


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

    // TODO: install opentelemtry operator
    // TODO: invoke helm chart installation. Change passed values
    let prometheusHelmChart;

    if (config.installPrometheus) {
        prometheusHelmChart = installHelmRelease('prometheus', '25.19.1', namespace, './charts_values/prometheus_values.yaml', 'https://prometheus-community.github.io/helm-charts')
    }

    let lokiHelmChart;

    if (config.installLoki) {
        lokiHelmChart = installHelmRelease('loki', '6.2.1', namespace, './charts_values/loki_values.yaml', 'https://grafana.github.io/helm-charts')
    }

    let tempoHelmChart;

    if (config.installTempo) {
        createBucket(namespace)
        tempoHelmChart = installHelmRelease('tempo', '1.7.2', namespace, './charts_values/tempo_values.yaml', 'https://grafana.github.io/helm-charts'), { dependsOn: [lokiHelmChart] }
    }
    
    //
    // TODO: further installed chart processing if required

    // return Pulumi outputs
    return {}
}
