import os

from dotenv import load_dotenv
from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
from flask_cors import CORS

cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})

db = SQLAlchemy()
migrate = Migrate()


def create_app() -> Flask:
    app = Flask(__name__)
    load_dotenv()

    # Конфигурация CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": "http://localhost:3000",
            "allow_headers": ["Authorization", "Content-Type"],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "supports_credentials": True
        }
    })

    # Конфигурация
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Инициализация расширений
    db.init_app(app)
    migrate.init_app(app, db)
    cache.init_app(app)



    # Регистрация blueprint'ов
    from .auth.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    from .admin.routes import admin_bp
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    from .schedule.routes import schedule_bp
    app.register_blueprint(schedule_bp, url_prefix='/api/schedule')


    return app
