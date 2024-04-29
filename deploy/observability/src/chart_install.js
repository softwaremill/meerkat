import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import { FileAsset } from '@pulumi/pulumi/asset/index.js';

export class HelmRelease extends pulumi.ComponentResource {

    constructor(releaseName, helmConfig, opts) {
        super("meerkat:HelmRelease", releaseName, helmConfig, opts);

        let helmRelease = new k8s.helm.v3.Release(releaseName, {
            chart: helmConfig.chartName,
            name: helmConfig.chartName,
            version: helmConfig.chartVersion,
            namespace: helmConfig.chartNamespace,
            valueYamlFiles: [new FileAsset(helmConfig.chartValuesPath)],
            repositoryOpts: {
                repo: helmConfig.chartRepositoryUrl,
            }
        },
            { parent: this },
        );

        this.chartName = helmRelease.name;
        this.registerOutputs();
    }
}
