import secrets
from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import current_app, request, jsonify, g

from .. import db


def create_tokens(user_id, role):
    access_token_payload = {
        'sub': user_id,
        'role': role,
        'type': 'access',
        'exp': datetime.utcnow() + timedelta(minutes=60)
    }
    refresh_token_payload = {
        'sub': user_id,
        'jti': secrets.token_hex(16),
        'type': 'refresh',
        'exp': datetime.utcnow() + timedelta(days=7)
    }

    access_token = jwt.encode(
        access_token_payload,
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )

    refresh_token = jwt.encode(
        refresh_token_payload,
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )

    return access_token, refresh_token


def validate_token(token):
    try:
        payload = jwt.decode(
            token,
            current_app.config['SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise ValueError("Token expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")


def create_jwt_token(user_id, role):
    try:
        payload = {
            'sub': user_id,
            'role': role,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        return jwt.encode(
            payload,
            current_app.config['SECRET_KEY'],
            algorithm='HS256'
        )
    except Exception as e:
        current_app.logger.error(f"Token creation error: {str(e)}")
        raise


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header is missing'}), 401

        try:
            token = auth_header.split()[1]  # Bearer <token>
            payload = jwt.decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=['HS256']
            )
            if payload.get('role') != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({'error': f'Invalid token: {str(e)}'}), 401
        except Exception as e:
            return jsonify({'error': f'Authorization error: {str(e)}'}), 500

        return f(*args, **kwargs)

    return decorated_function


def invalidate_all_tokens(user):
    user.refresh_token = None
    db.session.commit()


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            payload = validate_token(token.split()[1])
            if payload['type'] != 'access':
                return jsonify({'error': 'Access token required'}), 403
            g.user_id = payload['sub']
        except ValueError as e:
            return jsonify({'error': str(e)}), 401

        return f(*args, **kwargs)

    return decorated
