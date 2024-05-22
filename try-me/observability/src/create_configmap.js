import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import fs from 'fs';

export class Configmap extends pulumi.ComponentResource {

    constructor(configmap, parameters, opts) {
        super("meerkat:Configmap", configmap, parameters, opts);

        // Load the JSON file 
        const data = fs.readFileSync(parameters.configmapFilePath, 'utf8');

        let configMap = new k8s.core.v1.ConfigMap(configmap, {
            metadata: {
                name: parameters.configmapName,
                namespace: parameters.configmapNamespace,
                labels: parameters.configmapLabels,
            },
            data: {
                [parameters.configmapDataName]: data,
            },
        }, { parent: this });
    }

}
