# Install

## prerequisite
az login
helm fetch azure-marketplace/postgresql

## postgresql
### install postresql on osx
```
# search check if already installed
brew search postgresql

# install
brew install postgresql

# check version
postgres --version

# start service
postgres -D /usr/local/var/postgres

# connection test
psql postgres

# show user list
\du

 Role name |                         Attributes                         | Member of
-----------+------------------------------------------------------------+-----------
 postgres   | Superuser, Create role, Create DB, Replication, Bypass RLS | {}


you can add new user and assign minimum permission role for security.

# add new user for dev
create user new_user password 'passwd';

you can check new_user using \du command.

# create DB
create database test_db encoding 'utf-8';

# assign DB ownership to new user
alter database test_db owner to new_user;

# assign permission to user
grant all on database test_db to new_user with grant option;

you can check new_user added and assigned all permission on test_db;

ams-# \l
                            List of databases
   Name    |  Owner  | Encoding | Collate | Ctype |  Access privileges
-----------+---------+----------+---------+-------+----------------------
 ams       | sysdev  | UTF8     | C       | C     | =Tc/sysdev          +
           |         |          |         |       | sysdev=C*T*c*/sysdev
 postgres  | sysmoon | UTF8     | C       | C     |
 template0 | sysmoon | UTF8     | C       | C     | =c/sysmoon          +
           |         |          |         |       | sysmoon=CTc/sysmoon
 template1 | sysmoon | UTF8     | C       | C     | =c/sysmoon          +
           |         |          |         |       | sysmoon=CTc/sysmoon

# connection test by new_user
you can login again after exit.
psql -U new_user -d test_db

but, you can be switched to another user with a connection.
\c test_db another_user

# create table

```

### Install postgres on AKS using helm


- Deploy postgres to AKS
```
./deploy.sh
   1   │ #!/bin/bash
   2   │
   3 ~ │ # create namespace
   4 ~ │ kubectl create ns postgres
   5 ~ │
   6 ~ │ # depoy
   7 ~ │ helm upgrade --install postgresql --namespace postgres \
   8   │   -f values.yaml \
   9 ~ │   --set postgresqlPassword=your-passwd,postgresqlDatabase=ams \
  10   │   --set service.type=LoadBalancer \
  11   │   azure-marketplace/postgresql
```

- check whether postgre deployed well in AKS.
```
(⎈ |prl-kc-k8s-istiobooks:default) ~/workspace/caa/ams/infra/postgresql   main ±  k get all -n postgres
NAME                          READY   STATUS    RESTARTS   AGE
pod/postgresql-postgresql-0   1/1     Running   0          7m56s

NAME                          TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)          AGE
service/postgresql            LoadBalancer   10.0.48.222   x.x.x.x   5432:31468/TCP   7m57s
service/postgresql-headless   ClusterIP      None          <none>        5432/TCP         7m57s

NAME                                     READY   AGE
statefulset.apps/postgresql-postgresql   1/1     7m57s
```

- Connection test
You can connect to postgres using AKS LoadBalancer IP/PORT
```
psql -h x.x.x.x -U postgres -d ams
```

### python
pip install psycopg2
