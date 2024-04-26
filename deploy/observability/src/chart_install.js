import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import fs from 'fs';
import yaml from 'js-yaml';

export class HelmRelease extends pulumi.ComponentResource {

    _readValuesFile(path) {
        let values = {};
        try {
            const loadValues = fs.readFileSync(path, 'utf8');
            values = yaml.load(loadValues);
        }
        catch (e) {
            console.log("Error reading file:", e);
        }

        return values;
    }

    constructor(releaseName, helmConfig, opts) {
        super("meerkat:HelmRelease", releaseName, helmConfig, opts);

        let values = this._readValuesFile(helmConfig.chartValuesPath);

        let helmRelease = new k8s.helm.v3.Release(releaseName, {
            chart: helmConfig.chartName,
            name: helmConfig.chartName,
            version: helmConfig.chartVersion,
            namespace: helmConfig.chartNamespace,
            values: values,
            repositoryOpts: {
                repo: helmConfig.repoUrl,
            }
        },
            { parent: this },
        );

        this.chartName = helmRelease.name;
        this.registerOutputs();
    }
}
