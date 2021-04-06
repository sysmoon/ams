# Install

## MongoDB
atlas: https://www.mongodb.com/cloud/atlas (free mongodb)
chart: https://github.com/bitnami/charts/blob/master/bitnami/mongodb/README.md

- Add helm repo for bitnami/monbodb
```
helm repo add bitnami https://charts.bitnami.com/bitnami

helm update

helm serach repo mongodb
(⎈ |prl-kc-k8s-istiobooks:default) ~/workspace/caa/ams/infra/mongodb   main ±  helm search repo mongodb
NAME                                    CHART VERSION   APP VERSION     DESCRIPTION
azure-marketplace/mongodb               10.11.1         4.4.4           NoSQL document-oriented database that stores JS...
azure-marketplace/mongodb-sharded       3.4.4           4.4.4           NoSQL document-oriented database that stores JS...
bitnami/mongodb                         10.11.1         4.4.4           NoSQL document-oriented database that stores JS...
bitnami/mongodb-sharded                 3.4.4           4.4.4           NoSQL document-oriented database that stores JS...
bitnami/mean                            6.1.2           4.6.2           DEPRECATED MEAN is a free and open-source JavaS...

```

- Download chart
```
helm pull bitnami/mongodb
tar -zxvf mongodb-10.11.1.tgz
cp mongodb/values.yaml ./
```
You can check downloaded chart file (ex: mongodb-10.11.1.tgz)

- Deploy
You can deploy mongodb using helm chart. (deploy.sh)

```
./deploy.sh

       │ File: deploy.sh
───────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ #!/bin/bash
   2   │
   3   │ helm upgrade --install mongodb -f values.yaml \
   4   │   --set service.type=LoadBalancer \
   5   │   --set auth.rootPassword=<your-passwd>,auth.username=systest,auth.password=<your-passwd>,auth.database=ams \
   6   │   --set persistence.size=10Gi \
   7   │   -n mongodb \
   8   │   bitnami/mongodb
```

- Check whether mongodb service was deployed in sucessfully to AKS
```
(⎈ |prl-kc-k8s-istiobooks:default) ~/workspace/caa/ams/infra/mongodb   main ±  k get all -n mongodb
NAME                           READY   STATUS    RESTARTS   AGE
pod/mongodb-74768464b9-5vvbz   1/1     Running   0          6m10s

NAME              TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)           AGE
service/mongodb   LoadBalancer   10.0.95.248   52.141.61.234   27017:32693/TCP   6m10s

NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/mongodb   1/1     1            1           6m10s

NAME                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/mongodb-74768464b9   1         1         1       6m10s
```

- connecto to mongodb
```
mongo 52.141.61.234:27017/ams -u <username> -p
```

