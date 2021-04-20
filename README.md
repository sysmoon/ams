# Introduce
CCS 공통모듈을 위한 AMS (API Management Service) Framework(/w GraphQL) 개발하고,
GraphQL 주요 기능에 대한 PoC 검증을 위한 아키텍처를 설계합니다.

# Features
- 멀티프로토콜을 위한 API 지원 (REST, GraphQL, gRPC ..)
- 멀티 DBMS 연동 지원 (RDS(Aurora, PostgreSQL), NoSQL(MongoDB), In-Memory(Redis))
- Legacy REST API 연동 (GraphQL Relay)
- API 명세서 (API Document)
- 보안 (인증/권한/접근제어)

# Architecture
[Netflix Beyond API 기술세미나 자료 참고](docs/Netflix_Beyond_API.pptx)

![GraphQL PoC Architecture](imgs/architecture_poc.png)

# Setup
## mongodb
추가예정

## postgresql
추가예정

## graphql

### Souce Structure
- github: https://github.com/sysmoon/ams
- source tree
```
ams
├── docs
├── infra
│   ├── aks
│   ├── mongodb
│   ├── postgresql
│   └── redis
├── scripts
│   └── __pycache__
└── src
    ├── client
    │   ├── node_modules
    │   ├── public
    │   └── src
    └── server
        ├── data-in-csv
        ├── models
        ├── node_modules
        └── typedefs-resolvers
```

* infra
  - AKS 설치 스크립트 파일 (azcli)
  - helm chart
    - mongodb
    - postgresql
    - redis (미적용 상태)
* scripts
  - 개발/운영에 필요한 스크립트 파일
* src
  - client: graphql frontend (react + apollo)
  - server: graphql backend (nodehs + apollo)
    - models: DB 모델 관리
    - typedefs-resolvers: graphql typedef/resolver 모듈 관리


### Backend

#### json server (restapi)
* API flow
Client -> API Gateway -> graphql server -> json server(restapi)

graphql server 에서 3rd party restapi 서버와 연동하여 relay 하기 위해 json server(restapi) 를 구축합니다.
json server는 json 파일 기반의 DB를 이용하여 쉽게 restapi 서비스 제공이 가능합니다.

* run
```
cd /src/json-server
npm start
```

json server 실행후, 브라우저를 통해 restapi 테스트가 가능합니다. (http://localhost:5000/)

* DB(db.json) 구조
* path: /src/json-server/db.json
* db.json 내용
```
       │ File: db.json
───────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ {
   2   │   "users": [
   3   │     {
   4   │       "id": "40",
   5   │       "firstName": "Alex",
   6   │       "age": 20,
   7   │       "companyId": "2"
   8   │     },
   9   │     {
  10   │       "id": "41",
  11   │       "firstName": "Nick",
  12   │       "age": 40,
  13   │       "companyId": "2"
  14   │     },
  15   │     {
  16   │       "firstName": "Samantha",
  17   │       "age": 25,
  18   │       "companyId": "1",
  19   │       "id": "S1TKHzuwl"
  20   │     },
  21   │     {
  22   │       "firstName": "Daniel",
  23   │       "age": 42,
  24   │       "companyId": "2",
  25   │       "id": "8o3vlHTQj"
  26   │     }
  27   │   ],
  28   │   "companies": [
  29   │     {
  30   │       "id": "1",
  31   │       "name": "Apple",
  32   │       "description": "iphone"
  33   │     },
  34   │     {
  35   │       "id": "2",
  36   │       "name": "Google",
  37   │       "description": "search"
  38   │     }
  39   │   ]
  40   │ }
```

#### graphql server

* graphql 개발에 필요한 nodejs 패키지 설치

```
cd /src/server
npm install
```



- 설치된 패키지 (/src/server/package.json)
```
       │ File: package.json
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ {
   2   │   "name": "1-3-graphql-exp",
   3   │   "version": "1.0.0",
   4   │   "description": "",
   5   │   "main": "index.js",
   6   │   "scripts": {
   7   │     "test": "test",
   8   │     "start": "nodemon index.js"
   9   │   },
  10   │   "author": "yalco",
  11   │   "license": "ISC",
  12   │   "dependencies": {
  13   │     "apollo-server": "^2.19.0",
  14   │     "convert-csv-to-json": "^1.0.0",
  15   │     "dotenv": "^8.2.0",
  16   │     "graphql": "^15.4.0",
  17   │     "mongoose": "^5.12.3",
  18   │     "pg": "^8.5.1",
  19   │     "postgraphile-apollo-server": "^0.1.1"
  20   │   }
  21   │ }
```
- run
```
npm start
```

Apollo 서버 실행후, graphql playground (http://localhost:4000/) 브라우저 접속 통해 테스트 가능


#### model
client side 에서의 graphql 요청에 대해 nodejs는 DB(mongodb, postresql) 연동하여 데이터를 가져오기 위해 DB 모듈(mongoose,graphile) 모듈을 사용합니다. 이에 필요한 DB model을 정의하여 요청한 데이터에 대한 query/mutation 기능을 제공합니다.

- model list
```
(⎈ |prl-kc-k8s-istiobooks:default) ~/workspace/caa/ams   main ±  tree -L 2 src/server/models
src/server/models
├── equipments.js
├── index.js
├── peoples.js
├── roles.js
├── softwares.js
├── supplies.js
└── teams.js
```

- teams.js sample model
```
       │ File: teams.js
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ const mongoose = require('mongoose');
   2   │ const Schema = mongoose.Schema;
   3   │
   4   │ const TeamsSchema = new Schema({
   5   │   manager: {type: String},
   6   │   office: {type: String},
   7   │   extension_number: {type: String},
   8   │   mascot: {type: String},
   9   │   cleaning_duty: {type: String},
  10 ~ │   project: {type: String},
  11 ~ │   peoples: [{
  12 ~ │     type: Schema.Types.ObjectId,
  13 ~ │     ref: 'people'
  14 ~ │   }]
  15   │ });
  16   │
  17 ~ │ module.export = mongoose.model('team', TeamsSchema);
```

#### typedef/resolvers
DB Model 별 필요한 typedef/resolvers 를 파일 모듈로 별도 관리하여 유지보수 효율성 제공

- path: src/server/typedefs-resolvers
- graphql 명세에서 사용될 데이터 스키마 정의
- sample typedef (src/server/typedef-resolvers/teams.js)


```
       │ File: teams.js
───────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ const { gql } = require('apollo-server')
   2   │ const dbWorks = require('../dbWorks.js')
   3 + │ const mongodbWorks = require('../mongodbWorks.js')
   4   │
   5   │ const typeDefs = gql`
   6   │     type Team {
   7 ~ │         _id: ID!
   8   │         manager: String!
   9   │         office: String
  10   │         extension_number: String
  11   │         mascot: String,
  12   │         cleaning_duty: String!
  13   │         project: String
  14 ~ │         peoples: [People]
  15   │     }
  16   │
  17   │     input PostTeamInput {
  18   │         manager: String!
  19   │         office: String
  20   │         extension_number: String
  21   │         mascot: String,
  22   │         cleaning_duty: String!
  23   │         project: String
  24   │     }
  25   │ `
  26   │
  27   │ const resolvers = {
  28   │     Query: {
  29 ~ │         teams: (parent, args) => mongodbWorks.getTeams(args),
  30 ~ │         team: (parent, args) => mongodbWorks.getTeam(args),
  31   │     },
  32   │     Mutation: {
  33 ~ │         postTeam: (parent, args) => mongodbWorks.postTeam(args),
  34 ~ │         editTeam: (parent, args) => mongodbWorks.editTeam(args),
  35 ~ │         deleteTeam: (parent, args) => mongodbWorks.deleteTeam(args)
  36   │     }
  37   │ }
  38   │
  39   │ module.exports = {
  40   │     typeDefs: typeDefs,
  41   │     resolvers: resolvers
  42   │ }
  ```


### resolver biz logic
- 서비스 액션들을 함수로 지정
- graphql 요청에 따라 데이터 query/mutaion

각 resolver 파일에서 직접 DB 와 연동하여 데이터를 query/mutaion 하기 위한 비지니스 로직을 구현할 수 있지만, 이 경우 하나의 파일에서 모든 로직 구현시 복잡성이 증가할 수 있고, 특히 Multi DBMS 연동시 복잡한 데이터 관계로 개발/운영의 비효율성을 초래할 수 있습니다.
따라서 resolver 비지니스 로직은 각 DBMS 와 매칭하여 별도 파일로 관리하여 구현하도록 합니다.
위 typedefs-resolvers/teams.js 파일과 같이 resolvers 의 각  query/mutation 에 대한 비지니스 로직은 DBMS 타입에 따라 mongodbWorks (or postgresql) 로 별도 분리하여 개발 관라합니다.

아래와 같이 mongodb 에 있는 모든 team 의 정보를 요청하는 쿼리(teams)에 대한 비지니스 로직을 mongodbWorks.getTeams(args) 에서 구현할 수 있습니다.
```
const mongoose = require('mongoose');
const Teams= mongoose.model('team')
const People = mongoose.model('people')
const Role = mongoose.model('role')

const dbWorks = {
    getTeams: (args) => {
        console.log('getTeams' + JSON.stringify(args))

        return Teams.find(args)
                    .populate('peoples')
                    .populate({
                        path: 'peoples',
                        populate: {
                            path: 'team',
                            model: 'team'
                        }
                    })
                    .then((doc) => {
                        console.log(doc)
                        return doc
                    })
                    .catch((err) => {
                        console.error(err)
                    })
    }
```

## Frontend

- framework: react + apollo
- run
```
cd /src/client
npm start
```

http://localhost:3000 브라우저 접속 통해 테스트 가능
