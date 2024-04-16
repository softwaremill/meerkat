import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

// use to install Helm Charts
// TODO: override default values
export const installHelmChart = (chartName = 'default', chartVersion = 'default', chartNamespace = 'default', chartValuesPath = ' default') => {

    // TODO: preload yaml files from chartValuesPath

    return new k8s.helm.v3.Chart(chartName, {
        chart: chartName,
        version: chartVersion,
        namespace: chartNamespace,
        values: {} // TODO: add code load values from yaml files. Using YAML files for easy modification
    });
}
