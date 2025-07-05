from flask_bcrypt import generate_password_hash, check_password_hash

from .. import db


class User(db.Model):
    __tablename__ = 'users'

    ROLES = {
        'student': 'Student',
        'teacher': 'Teacher',
        'admin': 'Administrator'
    }

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student')
    is_active = db.Column(db.Boolean, default=True)
    refresh_token = db.Column(db.String(500), nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @classmethod
    def get_max_id(cls):
        return User.query.with_entities(db.func.max(User.id)).scalar() or 0

    @classmethod
    def create_batch(cls, users_data):
        """Метод для массового создания пользователей"""
        users = []
        for user_data in users_data:
            user = cls(
                email=user_data['email'],
                role=user_data.get('role', 'student')
            )
            user.set_password(user_data['password'])
            users.append(user)
        return users

    @property
    def role_name(self):
        return self.ROLES.get(self.role, 'Unknown')

    def __repr__(self):
        return f'<User {self.email} ({self.role})>'
