from flask import Blueprint, request, jsonify
from .services import AuthService

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    user = AuthService.register_user(email, password)
    if not user:
        return jsonify({'error': 'User already exists'}), 409

    return jsonify({'message': 'User created successfully'}), 201


@auth_bp.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return jsonify({'message': 'hello'}), 200
    else:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        user = AuthService.login_user(email, password)
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401

        return jsonify({'message': 'Logged in successfully'}), 200