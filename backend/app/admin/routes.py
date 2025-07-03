from flask import Blueprint, request, jsonify
from ..auth.models import User
from ..auth.utils import admin_required, create_jwt_token
from .. import db

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'email': user.email,
        'role': user.role.value,
        'is_active': user.is_active
    } for user in users])


@admin_bp.route('/users', methods=['POST'])
@admin_required
def create_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Валидация
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'student')

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 409

        if role not in ['student', 'teacher', 'admin']:
            return jsonify({'error': 'Invalid role'}), 400

        # Создание пользователя
        new_user = User(
            email=email,
            role=role
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'message': 'User created successfully',
            'user_id': new_user.id
        }), 201

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({'error': 'Internal server error'}), 500


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

    db.session.commit()
    return jsonify({'message': 'User updated successfully'})


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})