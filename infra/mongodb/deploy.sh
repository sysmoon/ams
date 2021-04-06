#!/bin/bash

helm upgrade --install mongodb -f values.yaml \
  --set service.type=LoadBalancer \
  --set auth.rootPassword=<your-passwd>,auth.username=systest,auth.password=<your-passwd>,auth.database=ams \
  --set persistence.size=10Gi \
  -n mongodb \
  bitnami/mongodb
