import * as pulumi from '@pulumi/pulumi';

// Loading config docs: https://www.pulumi.com/docs/concepts/config/
const observabilityConfig = new pulumi.Config();

const installPrometheus = observabilityConfig.requireBoolean('installPrometheus');
const installLoki = observabilityConfig.requireBoolean('installLoki');
const installTempo = observabilityConfig.requireBoolean('installTempo');
const installOpenTelemetryOperator = observabilityConfig.requireBoolean('installOpenTelemetryOperator');

export { installPrometheus, installLoki, installTempo, installOpenTelemetryOperator }
