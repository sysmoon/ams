import psycopg2
from config import POSTGRE_CONN
from my_logger import logger
import csv
import os
import glob
import argparse
import pymongo
from pprint import pformat
from dotenv import load_dotenv

# env
load_dotenv(
  dotenv_path='../src/server/.env',
  stream=None,
  verbose=True,
  override=False,
)

# define
CSV_FILES = [
    '../server/data-in-csv/teams.csv',
    '../server/data-in-csv/roles.csv',
    '../server/data-in-csv/softwares.csv',
    '../server/data-in-csv/supplies.csv',
    '../server/data-in-csv/equipments.csv',
    '../server/data-in-csv/people.csv',
  ]
MONGO_URI = os.getenv('MONGO_URI')
logger.info('mongouri={}'.format((os.getenv('MONGO_URI'))))

# arguments
parser = argparse.ArgumentParser(description='testing for insert to db')
parser.add_argument('--db_type', required=True, help='(option: mongodb<default>, postgres)')
args = parser.parse_args()
logger.info('args db={}'.format(args.db_type))

# postgre connection
def db_connect_pg():
  try:
    conn = psycopg2.connect(**POSTGRE_CONN)
    logger.info(
        "postgresql connection is created. connection_info: {}\n".format(
            conn
        )
    )
    return conn
  except Exception as e:
    print(e)

# mongodb connection
def db_connect_mongodb():
  # conn = pymongo.MongoClient("mongodb://{id}:{password}@{server_ip}:{port}/{db_name}")
  conn = pymongo.MongoClient(MONGO_URI)

  # db = conn['ams']
  logger.info("mongodb connnection is created. connection info:{}, \n".format(
    conn
  ))

  return conn


def insert_pg():
  # files = glob.glob('../data-in-csv/*.csv')

  # create sql
  for csvpath in CSV_FILES:
    with open(csvpath) as f:

      if(csvpath.endswith('teams.csv')):
        sql = '''
              INSERT INTO teams(id, manager, office, extension_number, mascot, cleaning_duty, project)
                            VALUES(%s, %s, %s, %s, %s, %s, %s)
              '''
      elif(csvpath.endswith('roles.csv')):
        sql = '''
              INSERT INTO roles(id, job, requirement)
                            VALUES(%s, %s, %s)
              '''
      elif(csvpath.endswith('softwares.csv')):
        sql = '''
              INSERT INTO software(id, used_by, developed_by, description)
                            VALUES(%s, %s, %s, %s)
              '''
      elif(csvpath.endswith('supplies.csv')):
        sql = '''
              INSERT INTO supplies(id, team)
                            VALUES(%s, %s)
              '''
      elif(csvpath.endswith('equipments.csv')):
        sql = '''
              INSERT INTO equipments(id, used_by, count, new_or_used)
                            VALUES(%s, %s, %s, %s)
              '''
      elif(csvpath.endswith('people.csv')):
        sql = '''
              INSERT INTO people(id, first_name, last_name, sex, blood_type, serve_years, role, team, froms)
                            VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)
              '''

      # read csv file & skip header
      csvreader = csv.reader(f, delimiter=',')
      next(csvreader)

      # insert many
      datas = []
      for row in csvreader:
        datas.append(tuple(row))
        logger.info(row)

def insert_mongodb():
  try:
    with db_connect_mongodb() as conn:
      db = conn['ams']

      # check whether collection is exist.
      collections = db.list_collection_names()

      stats = {}

      for csvpath in CSV_FILES:
        # get collection name using by csvpath (ex:/bla/bla/teams.csv). In this case collection_name is become teams.
        base = os.path.basename(csvpath)
        collection_name = os.path.splitext(base)[0]
        logger.info(collection_name)

        # skip if collection_name exist already.
        if collection_name in collections:
          logger.info('collection({}) is exist already. so skipped inserting data to prevent duplication.'.format(collection_name))
          continue

        # list up for insert_many
        datas = []
        with open(csvpath, 'r') as f:
          for line in csv.DictReader(f):
            # id key is replaced with mogodb id automatically generated. so delete id colume.
            deleted_key = line.pop('id')
            # logger.info(line)

            datas.append(line)

        # insert many
        col = db[collection_name]
        if(len(datas) > 0):
          results = col.insert_many(datas)
          inserted_count = len(results.inserted_ids)
          logger.info('collection:{}, count={}'.format(collection_name, inserted_count))
          logger.info('==================================================\n')

          stats[collection_name] = inserted_count

      # show results of stats about mongodb insert
      logger.info('==================================================\n')
      logger.info('total inserted stats={}'.format(pformat(stats)))

  except Exception as e:
    logger.error(e)
  finally:
    # logger.info('stats={}'.format(stats))
    pass

if __name__ == '__main__':
  if(args.db_type == 'postgre'):
    insert_pg()
  elif(args.db_type == 'mongodb'):
    insert_mongodb()
    pass
