목차
(K8s Helm) Redis-Sentinel 설치
redis-cli 테스트
Python 개발 테스트
Redis-Sentinel 개요
FailOver 전략
Data Backup 개요
Data Backup 테스트
Log Monitoring
성능 Tuning


1. (K8s Helm) Redis-Sentinel 설치

# K8s Redis-Sentinel Resource 정의 yaml 다운로드
curl -Lo values-production.yaml https://raw.githubusercontent.com/bitnami/charts/master/bitnami/redis/values-production.yaml

# Edit
- 아래와 같이 sentinel 을 true 로 설정
sentinel:
   enabled: true

# Installation
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis --values values-production.yaml
helm ls
kubectl get po

(base) bash-3.2$ kubectl get po
NAME READY STATUS RESTARTS AGE
redis-master-0 3/3 Running 0 14h
redis-slave-0 3/3 Running 2 14h
redis-slave-1 3/3 Running 0 14h
redis-slave-2 3/3 Running 0 14h

(base) bash-3.2$ kubectl get svc
NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE
kubernetes ClusterIP 10.0.0.1 <none> 443/TCP 47h
redis ClusterIP 10.0.143.53 <none> 6379/TCP,26379/TCP 14h
redis-headless ClusterIP None <none> 6379/TCP,26379/TCP 14h
redis-metrics ClusterIP 10.0.216.86 <none> 9121/TCP 14h


# password 확인
export REDIS_PASSWORD=$(kubectl get secret --namespace default redis -o jsonpath="{.data.redis-password}" | base64 --decode)
echo $REDIS_PASSWORD

# 마스터 포트 확인
kubectl get pod redis-master-0 --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'

(todo)
- namespace 설정
- prometheus 수집 확인
- 기타 설정값 Tuning 등등



2. redis-cli 테스트 (HDMAP Update 관련 pod에서 redis 접근 가능 여부)

# redis-cli test 를 위한 pod 생성
kubectl run --namespace default redis-client --rm --tty -i --restart='Never' \
--env REDIS_PASSWORD=$REDIS_PASSWORD \--labels="redis-client=true" \
--image docker.io/bitnami/redis:6.0.3-debian-10-r2 -- bash

# redis-cli TEST
redis-cli -h redis-headless -p 6379 -a $REDIS_PASSWORD # Read/Write operations
redis-cli -h redis -p 6379 -a $REDIS_PASSWORD # Read only operations
redis-cli -h redis -p 26379 -a $REDIS_PASSWORD # Sentinel access

> set foo hello
> get foo



3. Python 개발 테스트 (개발자 로컬 PC 에서 테스트)

# 로컬 7000 포트 연결  →  Redis 서버가 실행 중인 파드의 6379 포트로 포워딩
kubectl port-forward redis-master-0 7000:6379 &
kubectl port-forward svc/redis-metrics 9121:9121 &         ← Prometheus 관련
curl 127.0.0.1:9121/metrics

# Python - Redis Test Code (개발자 PC)

(pip install redis)

import redis

def connect_redis():
     try:
         conn = redis.StrictRedis(
                host='localhost', port='7000', password='xxxxxxxx', db=2)

     except Exception as e:
           print("REDIS connection error: ", e)

     return conn

def test_redis():
     conn = connect_redis()
     result = conn.info(section='memory')
     print(result)
     print('Set Record:', conn.set("test", "Hello World!"))
     print('Get Record:', conn.get("test"))
     print('Delete Record:', conn.delete("test"))
     print('Get Deleted Record:', conn.get("test"))

test_redis()

---
Set Record: True
Get Record: b'Hello World!'
Delete Record: 1
Get Deleted Record: None

# 포트포워딩 제거
ps aux | grep kubectl
kill -9 xxxxx



4. Redis-Sentinel 개요

(1) Master-Slave Replication
read/write 되는 master 서버 1대  →  slave n개의 서버로 데이터가 실시간으로 복제
slave 는 read 작업만 가능
master 서버에 장애가 발생하는 경우 slave 가 master 로 FailOver 되지 않음
다만, master 장애 발생 시에도 slave 에 대해 읽기 작업은 가능함

(2) Master-Slave-Sentinel Replication
Sentinel 서버가 모니터링   →  마스터 서버에 장애가 감지되면 Slave 서버를 Master 서버로 자동 전환 (FailOver)
Sentinel 서버 1대가 장애를 감지했다고 해서, 즉시 FailOver 되는 것은 아니며, 하기의 프로세스를 따름

(3) SDOWN vs ODOWN
SDOWN - Sentinel Instance 가 Master 와 접속이 끊긴 경우 주관적 다운 상태(Subjectively Down Condition) 로 전환
ODOWN - SDOWN 상태인 Sentinel 들이 많아지면, 객관적 다운 상태(Objectively Down Condition) 로 전환
(sentinel.conf) sentinel down-after-milliseconds master 3000 - Sentinel 이 master 서버에 Ping 을 보내고 3초 동안 응답이 없으면 다운된 것으로 판단 (default 60초, 확인 및 조정 필요)

(4) quorum
ODOWN 상태를 판단하기 위한 기준
quorum 값이 2 이면, 최소 2대 이상의 Sentinel 이 동의해야 한다는 뜻
Sentinel 이 3대이면, 2 라는 값을 만족하고, 동시에 과반수가 넘어 새로운 Master 를 선출하게 된다.
Sentinel 은 3대 이상, 홀수 개로 구성하는 것이 일반적

(5) Sentinel 기능
모니터링 - HeartBeat
장애 알림(Notification) - 문자 메시지 또는 이메일
Auto FailOver


5. FailOver 전략

(1) FailOver 절차 정리
Sentinel 서버는 매 1초마다 HeartBeat 를 통해 Mater/Slave 서버 생사 체크
down-after-milliseconds 파라미터 값(3초) 에 근거해서, TimeOut 발생했다고 판단하면 sdown 상태 전환
quorum(정족수) 파라미터에 근거해서, 장애 판단 정족수를 넘어서면, odown 상태 전환
odown 상태에서, Sentinel Leader 선출하고, Leader 는 Master 서버를 대신할 Slave 서버를 선정
선정된 Slave 는 Master 로 승격
다른 Slave 서버가 새로 승격된 Master 를 바라보고 데이터 실시간 복제
장애가 복구되면, Sentinel 서버 정보 갱신되고 장애 복구 작업 종료

(2) FailOver 시 주의 사항
Master, Slave 모두 다운되었을 때, 센티널에 접속해서 마스터 서버 정보를 요청하면 이미 다운된 서버 정보를 리턴한다.

sentinel get-master-addr-by-name master        ← 마스터 서버 정보 확인 명령어 (이미 다운된 서버 정보를 리턴해 버린다)
info sentinel                                              ← 마스터 서버의 다운 여부를 확인하는 명령어 (현재 시스템에 문제 없는지 확실하게 판단할 수 있다)


Slave → Master 승격에 실패하는 경우 (확인 필요)

Slave 가 먼저 다운되고, 마스터가 다운된 다음, 다시 Slave가 재기동하는 경우 마스터로 전환 실패한다.
해결책은 Slave 를 시작하기 전에 redis.conf 에서 slaveof 를 삭제하는 것이다.


Master 와 1차 Slave 가 거의 동시에 다운되는 경우 (확인 필요)

2차 Slave 가 있어도 FailOver 에 실패하게 된다. Sentinel 은 Master 와 1차 Slave 정보는 있지만, 2차 Slave 정보는 없기 때문


마스터와 1차 Slave 가 10초 차이로 다운되는 경우 (확인 필요)

down-after-milliseconds 파라미터 값이 3초라고 가정하면, 대부분의 경우 4초면 Slave 가 Master 로 승격된다.
그러면 2차 Slave 가 1차 Slave 로 승격되므로 FailOver 가 성공한다.

Sentinel 대수와 Quorum 값  -  최소 권장 사항은 Sentinel 3대, quorum 2


6. Data Backup
Redis 는 백업을 위해 AOF 방식과 RDB 방식을 지원한다.

(1) AOF 방식 (https://mozi.tistory.com/369)
AOF(Append Only File) : 실행한 명령을 텍스트 파일에 기록한다. 데이터 손실 거의 없음 (버퍼에서 주기적으로 기록)
appendonly.aof       ← 조회 명령을 제외
AOF Rewrite : rewrite 하면 최종 수정된 마지막 값만 남는다. (파일 사이즈 관리 차원)
TIP : 명령어를 잘못 사용해서 데이터가 삭제된 경우, 삭제 명령어를 AOF 파일에서 제거하고 Redis 재부팅하면 복구된다.

(2) RDB 방식
특정 시점의 메모리에 있는 데이터를 바이너리 파일로 저장
사이즈 작으며, 빠르게 로딩할 수 있다.
dump.rdb 파일에 기록 (저장 시점을 정할 수 있음)


7. Data Backup Test

(base) (anaconda3-5.3.1) Mac-Pro:roadLearner_redis hdkim$ kubectl get po
NAME READY STATUS RESTARTS AGE
redis-master-0 3/3 Running 0 18h
redis-slave-0 3/3 Running 2 18h
redis-slave-1 3/3 Running 0 18h
redis-slave-2 3/3 Running 0 18h
(base) (anaconda3-5.3.1) Mac-Pro:roadLearner_redis hdkim$ kubectl exec -it redis-slave-0 -- /bin/bash
I have no name!@redis-slave-0:/$ ls
bin bitnami boot data dev entrypoint.sh etc health home lib lib64 media mnt opt proc root run run.sh sbin srv sys tmp usr var
I have no name!@redis-slave-0:/$ cd data
I have no name!@redis-slave-0:/data$ ls
appendonly.aof dump.rdb lost+found
I have no name!@redis-slave-0:/data$ tail appendonly.aof
SET
$4
test
$16
Nice to meet you
*2
$3
DEL
$4
test
I have no name!@redis-slave-0:/data$


(todo)
- AOF 파라미터 설정 Tuning (특히 Rewrite 관련)
- RDB 파라미터 설정 Tuning (저장 시점 지정 등등)
