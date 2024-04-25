import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import fs from 'fs';
import yaml from 'js-yaml';

// use to install Helm Charts
// TODO: override default values
export const installHelmRelease = (chartName = 'default', chartVersion = 'default', chartNamespace = 'default', chartValuesPath = ' ./default-values.yaml', repoUrl = 'default', dependency) => {

    let values = {};

    try {
        const loadValues = fs.readFileSync(chartValuesPath, 'utf8');
        values = yaml.load(loadValues);
    }
    catch (e) {
        console.log("Error reading file:", e);
    }

    return new k8s.helm.v3.Release(chartName, {
        chart: chartName,
        name: chartName,
        version: chartVersion,
        namespace: chartNamespace,
        values: values,
        repositoryOpts: {
            repo: repoUrl,
        }
    },
        { dependsOn: dependency },
    );
}
