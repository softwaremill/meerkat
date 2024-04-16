#!/bin/bash
set -eufo pipefail
export SHELLOPTS	# propagate set to children by default

IFS=$'\t\n'

CLUSTER_NAME=observability-localstack

if kind get clusters | grep -q "^$CLUSTER_NAME$"
then
  kind delete cluster -n "$CLUSTER_NAME"
fi

printf "# Cluster %s deleted\n" "$CLUSTER_NAME"
