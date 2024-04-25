import * as k8s from '@pulumi/kubernetes';

export const createBucket = (namespace, dependency) => {

    return new k8s.batch.v1.Job("job", {
        metadata: {
            name: 'create-bucket',
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
                        }
                        ],
                        name: 'mc',
                        image: 'minio/mc',
                        command: ['sh', '-c'],
                        args: ['mc alias set minio http://loki-minio.observability:9000 $MINIO_ACCESS_KEY $MINIO_SECRET_KEY; mc mb minio/tempo-traces; mc anonymous set public minio/tempo-traces']
                    },],
                    restartPolicy: 'OnFailure',
                },
            },
        },
    },
        { dependsOn: dependency },
    );
}
