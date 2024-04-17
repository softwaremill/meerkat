'use strict';
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as config from './src/config.js'
import { installHelmChart } from './src/chart_install.js';


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
        prometheusHelmChart = installHelmChart('prometheus', '25.19.1', namespace, './charts_values/prometheus_values.yaml', 'https://prometheus-community.github.io/helm-charts')
    }
    //
    // TODO: further installed chart processing if required
    // TODO: install loki, tempo,

    // return Pulumi outputs
    return {}
}