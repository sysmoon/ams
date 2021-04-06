import os
from dotenv import load_dotenv

load_dotenv(verbose=True)

# postgresql
POSTGRE_CONN = {
    "host": os.environ["PG_HOST"],
    "port": os.environ["PG_PORT"],
    "database": os.environ["PG_DATABASE"],
    "user": os.environ["PG_USER"],
    "password": os.environ["PG_PASS"]
}

# # es
# ES_CONN = {
#     "host": os.environ["ES_HOST"],
#     "user": os.environ["ES_USER"],
#     "password": os.environ["ES_PASS"]
# }

# # redis
# REDIS_CONN = {
#     "host": os.environ["REDIS_HOST"],
#     "port": os.environ["REDIS_PORT"],
#     "password": os.environ["REDIS_PASS"],
# }

# # mongodb (azure cosmosdb)
# MONGO_CONN = {
#     "host": os.environ["MONGO_HOST"]
# }
