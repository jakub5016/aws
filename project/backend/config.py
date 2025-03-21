import os

class Config:
    # Deafult for RDS connected with elastic
    DB_USERNAME =  os.environ['RDS_USERNAME']
    DB_PASSWORD =  os.environ['RDS_PASSWORD']
    DB_HOST = os.environ['RDS_HOSTNAME']
    DB_PORT = os.environ['RDS_PORT']
    DB_NAME =  os.environ['RDS_DB_NAME']

    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False