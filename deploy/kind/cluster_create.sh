#!/bin/bash
set -eufo pipefail
export SHELLOPTS

IFS=$'\t\n'

KIND_CONFIG_FILE='./kind-config.yml'
CLUSTER_NAME=observability-localstack

printf "#: Checking if all Kubernetes dependencies are installed...\n"
command -v docker >/dev/null 2>&1 || { echo 'Please install docker'; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo 'Install kubectl before continuing'; exit 1; }
command -v kind >/dev/null 2>&1 || { bash 'Install kubectl before continuing'; exit 1; }
printf "Dependencies installed!\n"

# Do nothing if cluster already exists
if kind get clusters | grep -q "^$CLUSTER_NAME$"
then
  printf "WARN: Cluster %s already exists\n" "$CLUSTER_NAME"
  exit 0
fi

kind create cluster \
  --name "$CLUSTER_NAME" \
  --image "kindest/node:v1.29.2" \
  --config "$KIND_CONFIG_FILE" \
  --wait 30s \
  --retain

kubectl cluster-info
