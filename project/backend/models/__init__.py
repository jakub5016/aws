from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from models.message import Message
from models.file import File
