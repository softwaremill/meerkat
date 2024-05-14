import * as pulumi from '@pulumi/pulumi';

// Loading config docs: https://www.pulumi.com/docs/concepts/config/
const observabilityConfig = new pulumi.Config();

const installLoki = observabilityConfig.requireBoolean('installLoki');
const installTempo = observabilityConfig.requireBoolean('installTempo');
const installCertManager = observabilityConfig.requireBoolean('installCertManager');
const installOpenTelemetryOperator = observabilityConfig.requireBoolean('installOpenTelemetryOperator');
const installGrafana = observabilityConfig.requireBoolean('installGrafana');
const installMimir = observabilityConfig.requireBoolean('installMimir');

export { installLoki, installTempo, installCertManager, installOpenTelemetryOperator, installGrafana, installMimir }
