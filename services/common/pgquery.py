import os
import ssl
import sqlalchemy
import logging

db_config = {
    # Pool size is the maximum number of permanent connections to keep.
    "pool_size": 5,
    # Temporarily exceeds the set pool_size if no connections are available.
    "max_overflow": 2,
    # Maximum number of seconds to wait when retrieving a
    # new connection from the pool. After the specified amount of time, an
    # exception will be thrown.
    "pool_timeout": 30,  # 30 seconds
    # 'pool_recycle' is the maximum number of seconds a connection can persist.
    # Connections that live longer than the specified amount of time will be
    # reestablished
    "pool_recycle": 60,  # 1 minutes
}

db = None


def init_tcp_connection_engine(db_user, db_pass, db_name, db_hostname, db_port):
    logging.info(f"Creating DB pool")
    logging.info(f"{db_user},{db_pass},{db_name},{db_hostname},{db_port}")
    ssl_context = ssl.create_default_context()
    ssl_context.load_verify_locations("/etc/ssl/ca/ca.crt")
    pool = sqlalchemy.create_engine(
        # Equivalent URL:
        # postgresql+pg8000://<db_user>:<db_pass>@<db_host>:<db_port>/<db_name>
        sqlalchemy.engine.url.URL.create(
            drivername="postgresql+pg8000",
            username=db_user,  # e.g. "my-database-user"
            password=db_pass,  # e.g. "my-database-password"
            host=db_hostname,  # e.g. "127.0.0.1"
            port=db_port,  # e.g. 5432
            database=db_name,  # e.g. "my-database-name"
        ),
        connect_args={"ssl_context": ssl_context},
        **db_config,
    )
    # pool.dialect.description_encoding = None
    logging.info("DB pool created!")
    return pool


def init_socket_connection_engine(db_user, db_pass, db_name, unix_query):
    logging.info(f"Creating DB pool")
    pool = sqlalchemy.create_engine(
        # Equivalent URL:
        # postgresql+pg8000://<db_user>:<db_pass>@/<db_name>?unix_sock=/cloudsql/<cloud_sql_instance_name>
        sqlalchemy.engine.url.URL.create(
            drivername="postgresql+pg8000",
            username=db_user,  # e.g. "my-database-user"
            password=db_pass,  # e.g. "my-database-password"
            database=db_name,  # e.g. "my-database-name"
            query=unix_query,
        ),
        **db_config,
    )
    logging.info("DB pool created!")
    return pool


def init_connection_engine():
    db_user = os.environ["PG_DB_USER"]
    db_pass = os.environ["PG_DB_PASS"]
    db_name = os.environ["PG_DB_NAME"]
    if (
        "INSTANCE_CONNECTION_NAME" in os.environ
        and os.environ["INSTANCE_CONNECTION_NAME"].strip()
    ):
        logging.debug("Using socket connection")
        instance_connection_name = os.environ["INSTANCE_CONNECTION_NAME"]
        unix_query = {
            "unix_sock": f"/cloudsql/{instance_connection_name}/.s.PGSQL.5432"
        }
        return init_socket_connection_engine(db_user, db_pass, db_name, unix_query)
    else:
        logging.debug("Using tcp connection")
        db_host = os.environ["PG_DB_HOST"]
        # Extract host and port from db_host
        host_args = db_host.split(":")
        db_hostname, db_port = host_args[0], int(host_args[1])
        return init_tcp_connection_engine(
            db_user, db_pass, db_name, db_hostname, db_port
        )


def query_db(query_string):
    global db
    if db is None:
        db = init_connection_engine()

    logging.info("DB connection starting...")
    with db.connect() as conn:
        logging.debug("Executing query...")
        data = conn.execute(sqlalchemy.text(query_string)).fetchall()
        return data


def write_db(query_string):
    global db
    if db is None:
        db = init_connection_engine()

    logging.info("DB connection starting...")
    with db.connect() as conn:
        logging.debug("Executing insert query...")
        conn.execute(sqlalchemy.text(query_string))
        conn.commit()
