from flask import Flask, send_from_directory
from config import Config
from models import db, User
from flask_login import LoginManager
from flask_cors import CORS
import os
import logging

app = Flask(__name__, static_folder='../build', static_url_path='/')
app.config.from_object(Config)

CORS(app, supports_credentials=True)  # Asegura que supports_credentials sea True

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

logging.basicConfig(level=logging.DEBUG)

# Importa las rutas después de inicializar app y db
from routes import api
app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
