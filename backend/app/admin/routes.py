from flask import Blueprint, request, jsonify, current_app

from .. import db
from ..auth.models import User
from ..auth.utils import admin_required
from sqlalchemy.exc import IntegrityError
from flask_cors import cross_origin

ORIGIN = 'http://localhost:3000' #TODO

admin_bp = Blueprint('admin', __name__)


def handle_options_request():
    if request.method == 'OPTIONS':
        response = jsonify()
        response.headers.add('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        return response


@admin_required
@admin_bp.route('/users/batch', methods=['POST'])
def create_users_batch():
    try:

        data = request.get_json()


        if not isinstance(data, list):
            return jsonify({'error': 'Expected array of users'}), 400

        if len(data) > 100:
            return jsonify({'error': 'Batch too large (max 100)'}), 400
        max_id = User.get_max_id()
        next_id = max_id + 1 if max_id else 1
        users_data = []
        for i in range(len(data)):
            item = data[i]
            if not all(k in item for k in ['email', 'password']):
                return jsonify({'error': 'Email and password required for each user'}), 400

            users_data.append({
                'id': next_id + i,
                'email': item['email'],
                'password': item['password'],
                'role': item.get('role', 'student')
            })

        try:
            db.session.begin_nested()

            users = User.create_batch(users_data)
            db.session.bulk_save_objects(users)
            db.session.commit()

            return jsonify({
                'message': f'{len(users)} users created successfully',
                'count': len(users)
            }), 201

        except IntegrityError as e:
            db.session.rollback()
            return jsonify({'error': 'Duplicate email found in batch'}), 409

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Batch create error: {str(e)}")
        return jsonify({'error': f'{str(e)}'}), 500


@admin_bp.route('/users/all', methods=['GET'])
@admin_required
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'email': user.email,
        'role': user.role,
        'is_active': user.is_active,
        'refresh_token': user.refresh_token
    } for user in users])


@admin_bp.route('/users', methods=['POST'])
@admin_required
def create_user():
    try:
        data = request.get_json()

        user_data = data if isinstance(data, dict) else data.get('user', {})

        if not user_data:
            return jsonify({'error': 'User data required'}), 400

        max_id = User.get_max_id()
        next_id = max_id + 1 if max_id else 1
        user_data['id'] = next_id

        try:
            users = User.create_batch([user_data])
            db.session.add(users[0])
            db.session.commit()

            return jsonify({
                'message': 'User created successfully',
                'user_id': users[0].id
            }), 201

        except IntegrityError:
            db.session.rollback()
            return jsonify({'error': 'Email already exists'}), 409

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'error': f'{e}'}), 500


@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.set_password(data['password'])
    if 'role' in data:
        user.role = User.ROLES[data['role']]
    if 'is_active' in data:
        user.is_active = data['is_active']
    try:
        db.session.commit()
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'error': f'{str(e)}'}), 400
    return jsonify({'message': 'User updated successfully'})


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})
