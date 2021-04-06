#!/bin/bash

# create namespace
kubectl create ns postgres

# depoy
helm upgrade --install postgresql --namespace postgres \
  -f values.yaml \
  --set postgresqlPassword=<your-passwd>,postgresqlDatabase=ams \
  --set service.type=LoadBalancer \
  azure-marketplace/postgresql
