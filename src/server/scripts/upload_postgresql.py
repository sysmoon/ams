import psycopg2
from config import POSTGRE_CONN
from my_logger import logger
import csv
import os
import glob


# creaste db connection
def dbConnect():
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

def importcsv():
  # files = glob.glob('../data-in-csv/*.csv')
  files = [
    # '../data-in-csv/teams.csv',
    # '../data-in-csv/roles.csv',
    # '../data-in-csv/softwares.csv',
    # '../data-in-csv/supplies.csv',
    # '../data-in-csv/equipments.csv',
    '../data-in-csv/people.csv',
  ]

  for csvpath in files:
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


      # insert & commit
      csvreader = csv.reader(f, delimiter=',')

      # skip header
      next(csvreader)

      logger.info(csvpath)
      logger.info(sql)
      datas = []
      for row in csvreader:
        datas.append(tuple(row))

      try:
        with dbConnect() as conn:
          cur = conn.cursor()
          cur.executemany(sql, datas)
          conn.commit()
      except Exception as e:
        logger.error(e)
      finally:
        if conn:
          conn.close()

importcsv()
