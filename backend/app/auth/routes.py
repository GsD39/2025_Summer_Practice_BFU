from .services import AuthService

from flask import Blueprint, request, jsonify
from ..auth.models import User
from ..auth.utils import admin_required, create_jwt_token
from .. import db


auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    if not user.is_active:
        return jsonify({'error': 'Account disabled'}), 403

    # Генерируем токен
    token = create_jwt_token(user.id, user.role)

    return jsonify({
        'message': 'Logged in successfully',
        'token': token,  # Добавляем токен в ответ
        'user': {
            'id': user.id,
            'email': user.email,
            'role': user.role
        }
    }), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    # Только админ может регистрировать пользователей
    return jsonify({'error': 'Registration allowed only via admin panel'}), 403