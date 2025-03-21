from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flasgger import Swagger
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text

import os
import boto3
from botocore.exceptions import ClientError
from config import Config
from models import db, Message, File

app = Flask(__name__)
CORS(app)
swagger = Swagger(app)
app.config.from_object(Config)
db.init_app(app)
with app.app_context():
    db.create_all()
s3_client = boto3.client('s3')

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route("/check_db")
def check_db():
    """
    Sprawdź baze danych
    ---
    responses:
      200:
        description: sprawdzenie bazy danych
        schema:
          type: json
    """
    try:
        db.session.execute(text("SELECT 1")) 
        return jsonify({"status": "success", "message": "Database connected!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    
@app.route('/messages', methods=['GET'])
def get_messages():
    """
    Pobiera listę wiadomości
    ---
    responses:
      200:
        description: Lista wiadomości
        schema:
          type: array
          items:
            type: object
            properties:
              username:
                type: string
              message:
                type: string
    """
    all_messages = Message.query.all()
    messages_json = [{"username": msg.name, "message": msg.message} for msg in all_messages]

    return jsonify(messages_json)


@app.route('/gallery', methods=['GET'])
def get_gallery():
    """
    Pobiera listę plików w galerii
    ---
    responses:
      200:
        description: Lista przesłanych plików
        schema:
          type: array
          items:
            type: string
    """
    all_files = File.query.all()
    gallery = [gallery_file.file_name for gallery_file in all_files]
    return jsonify(gallery)


@app.route('/message', methods=['POST'])
def post_message():
    """
    Dodaje nową wiadomość
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - username
            - message
          properties:
            username:
              type: string
            message:
              type: string
    responses:
      201:
        description: Wiadomość dodana
      400:
        description: Błędne dane wejściowe
    """
    data = request.get_json()
    if not data or 'username' not in data or 'message' not in data:
        return jsonify({'error': 'Błędne dane'}), 400

    new_message = Message(name=data['username'], message=data['message'])
    db.session.add(new_message)
    db.session.commit()
    return jsonify({'status': 'Wiadomość dodana'}), 201


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Przesyła plik do galerii
    ---
    consumes:
      - multipart/form-data
    parameters:
      - name: file
        in: formData
        type: file
        required: true
    responses:
      201:
        description: Plik przesłany
      400:
        description: Brak pliku lub błąd przesyłania
    """
    if 'file' not in request.files:
        return jsonify({'error': 'Brak pliku'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nie wybrano pliku'}), 400

    try:
        s3_client.upload_fileobj(file, "awsbuckera", file.filename)
        new_file=File(file_name=file.filename)
        db.session.add(new_file)
        db.session.commit()
        
    except ClientError as e:
        print(e)

    return jsonify({'status': 'Plik przesłany', 'filename': file.filename}), 201


@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    """
    Pobiera przesłany plik
    ---
    parameters:
      - name: filename
        in: path
        type: string
        required: true
    responses:
      200:
        description: Zwraca plik
      404:
        description: Plik nie istnieje
    """
    obj = s3_client.get_object(Bucket="awsbuckera", Key=filename)
    return Response(obj['Body'].read(), content_type=obj['ContentType'])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
