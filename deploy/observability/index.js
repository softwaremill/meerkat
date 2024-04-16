'use strict';
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as config from './src/config.js'
import {installHelmChart} from './src/chart_install.js';


// TODO: create function which create namespace

export default async () => {

    // TODO: invoke namespace installation function

    // TODO: install opentelemtry operator

    // TODO: invoke helm chart installation. Change passed values
    let prometheusHelmChart;

    if (config.installPrometheus) {
        prometheusHelmChart = installHelmChart('promethues', 'X.Y.Z', 'namespace', 'path to values file')
    }
    //
    // TODO: further installed chart processing if required
    // TODO: install loki, tempo,

    // return Pulumi outputs
    return {}
}
