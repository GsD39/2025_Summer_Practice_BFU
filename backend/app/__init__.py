import os

from dotenv import load_dotenv
from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache

cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    load_dotenv()

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
