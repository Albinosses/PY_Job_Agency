import psycopg2
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists, create_database
        

base_db_params = {
    'hostname': 'localhost',
    'username': 'postgres',
    'password': '2204',
    'database': 'postgres',
}

OLTP_params = {
    'host': 'localhost',
    'user': 'postgres',
    'password': '2204',
    'database': 'OLTP'
}

OLAP_params = {
    'host': 'localhost',
    'user': 'postgres',
    'password': '2204',
    'database': 'OLAP'
}


def create_db_if_not_exist(params, sql_file):
    # connecting to base db in order to check if db exists
    conn = psycopg2.connect(
        dbname=base_db_params["database"],
        user=base_db_params["username"],
        password=base_db_params["password"],
        host=base_db_params["hostname"]
    )
    cur = conn.cursor()

    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (f'{params["database"]}',))
    oltp_exists = cur.fetchone()

    conn.close()
    cur.close()

    if not oltp_exists:
        create_database(
            f'postgresql+psycopg2://{params["user"]}:{params["password"]}@{params["host"]}/{params["database"]}')
        print("Created db")
        
        conn = psycopg2.connect(
            dbname = params["database"],
            user = params["user"],
            password = params["password"],
            host = params["host"]
        )
        cur = conn.cursor()
        
        with open(sql_file, 'r') as f:
            cur.execute(f.read())
        
        conn.commit()
        
        print ("Filled created db with schema")
        
    else:
        print('Db exists')
        

create_db_if_not_exist(OLTP_params, './db-sqls/OLTP.sql')
create_db_if_not_exist(OLAP_params, './db-sqls/OLAP.sql')