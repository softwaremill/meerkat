import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';

export class MinioBucket extends pulumi.ComponentResource {

    constructor(bucketName, namespace, opts) {
        super("meerkat:MinioBucket", bucketName, namespace, opts);

        new k8s.batch.v1.Job("create-" + bucketName + "-bucket", {
            metadata: {
                name: "create-" + bucketName + "-bucket",
                namespace: namespace,
            },
            spec: {
                template: {
                    spec: {
                        containers: [{
                            env: [{
                                name: 'MINIO_ACCESS_KEY',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: 'loki-minio',
                                        key: 'rootUser',
                                    },
                                },
                            },
                            {
                                name: 'MINIO_SECRET_KEY',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: 'loki-minio',
                                        key: 'rootPassword',
                                    },
                                }
                            },
                            {
                                name: 'BUCKET_NAME',
                                value: bucketName,
                            }
                            ],
                            name: 'mc',
                            image: 'minio/mc',
                            command: ['sh', '-c'],
                            args: ['mc alias set minio http://loki-minio.observability:9000 $MINIO_ACCESS_KEY $MINIO_SECRET_KEY; mc mb minio/$BUCKET_NAME; mc anonymous set public minio/$BUCKET_NAME']
                        },],
                        restartPolicy: 'OnFailure',
                    },
                },
            },
        },
            { parent: this },
        );

        this.registerOutputs();
    }
}
