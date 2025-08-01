from .models import User
from .. import db


class AuthService:
    @staticmethod
    def register_user(email, password, role):
        if User.query.filter_by(email=email).first():
            return None

        new_user = User(email=email)
        new_user.set_password(password)
        new_user.role = role
        db.session.add(new_user)
        db.session.commit()
        return new_user

    @staticmethod
    def login_user(email, password):
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return None
        return user
