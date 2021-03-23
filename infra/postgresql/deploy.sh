#!/bin/bash

helm upgrade --install postgresql \
  -f values.yaml \
  --set postgresqlPassword=caaqwer4321!,postgresqlDatabase=graphql \
  --set service.type=LoadBalancer \
  azure-marketplace/postgresql 
