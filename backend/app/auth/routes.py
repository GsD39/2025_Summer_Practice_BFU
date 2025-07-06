from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from flask_cors import cross_origin

ORIGIN = 'http://localhost:3000'

from .. import db
import os
from ..auth.models import User
from ..auth.utils import create_tokens, token_required, validate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/startup', methods=['POST'])
def startup():
    user = User.query.first()
    if user is None:
        default_admin_email = os.getenv('DEFAULT_ADMIN_EMAIL')
        default_admin_password = os.getenv('DEFAULT_ADMIN_PASSWORD')
        admin = User(
            email=default_admin_email,
            role="admin",
            is_active=True
        )
        admin.set_password(default_admin_password)
        db.session.add(admin)
        db.session.commit()
        return 200
    else:
        return jsonify({'error': 'default admin was already set'}), 403


@auth_bp.route('/logout', methods=['POST'])
@cross_origin(origin=ORIGIN, supports_credentials=True)
@token_required
def logout():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user:
        user.refresh_token = None
        db.session.commit()

    return jsonify({'message': 'Successfully logged out'})


@auth_bp.route('/login', methods=['POST'])
@cross_origin(origin=ORIGIN, supports_credentials=True)
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    if not user.is_active:
        return jsonify({'error': 'Account disabled'}), 403

    access_token, refresh_token = create_tokens(user.id, user.role)

    user.refresh_token = refresh_token
    db.session.commit()

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'role': user.role,
        'expires_in': 3600
    }), 200


@auth_bp.route('/refresh', methods=['POST'])
@cross_origin(origin=ORIGIN, supports_credentials=True)
def refresh():
    refresh_token = request.json.get('refresh_token')
    if not refresh_token:
        return jsonify({'error': 'Refresh token required'}), 400

    try:
        payload = validate_token(refresh_token)
        if payload['type'] != 'refresh':
            return jsonify({'error': 'Invalid token type'}), 400

        user = User.query.get(payload['sub'])
        if not user or user.refresh_token != refresh_token:
            return jsonify({'error': 'Invalid refresh token'}), 401

        # Создаем новые токены
        new_access, new_refresh = create_tokens(user.id, user.role)

        # Обновляем refresh-токен в БД
        user.refresh_token = new_refresh
        db.session.commit()

        return jsonify({
            'access_token': new_access,
            'refresh_token': new_refresh,
            'expires_in': 900
        })

    except ValueError as e:
        return jsonify({'error': str(e)}), 401
