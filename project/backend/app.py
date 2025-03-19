from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flasgger import Swagger
import os

app = Flask(__name__)
CORS(app)
swagger = Swagger(app)

messages = []
gallery = []

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


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
    return jsonify(messages)


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
    messages.append({
        'username': data['username'],
        'message': data['message']
    })
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
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    gallery.append(file.filename)
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
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
