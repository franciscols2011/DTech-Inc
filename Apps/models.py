from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import validates, relationship

db = SQLAlchemy()

post_likes = db.Table('post_likes',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('post_id', db.Integer, db.ForeignKey('post.id'), primary_key=True)
)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    avatar = db.Column(db.String(255))
    username = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(20), nullable=False)
    surname = db.Column(db.String(20), nullable=False)
    # No se usa backref aquí, se usa una relación explícita
    posts = db.relationship('Post', lazy=True, foreign_keys='Post.author_id', cascade="all, delete-orphan")
    liked_posts = db.relationship('Post', secondary=post_likes, lazy='dynamic')

    @validates('username')
    def validate_username(self, key, username):
        assert len(username) >= 3 and len(username) <= 20, "Username must be between 3 and 20 characters."
        return username

    @validates('password_hash')
    def validate_password(self, key, password_hash):
        return password_hash

    @validates('name', 'surname')
    def validate_name_surname(self, key, value):
        assert len(value) >= 3 and len(value) <= 20, f"{key} must be between 3 and 20 characters."
        return value

    def set_password(self, password):
        assert len(password) >= 5 and len(password) <= 10, "Password must be between 5 and 10 characters."
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(255), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    location = db.Column(db.String(30), nullable=False)
    status = db.Column(db.String(10), nullable=False)
    last_liked_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    last_liked_user = db.relationship('User', foreign_keys=[last_liked_user_id], post_update=True)
    author = db.relationship('User', foreign_keys=[author_id])
    liked_by_users = db.relationship('User', secondary=post_likes, lazy='dynamic')

    @validates('message')
    def validate_message(self, key, message):
        assert len(message) >= 10 and len(message) <= 500, "Message must be between 10 and 500 characters."
        return message

    @validates('location')
    def validate_location(self, key, location):
        assert len(location) >= 4 and len(location) <= 30, "Location must be between 4 and 30 characters."
        return location

    @validates('status')
    def validate_status(self, key, status):
        assert status in ['drafted', 'deleted', 'published'], "Status must be one of 'drafted', 'deleted', or 'published'."
        return status

    def like(self, user):
        if not self.is_liked_by(user):
            self.liked_by_users.append(user)
            self.last_liked_user_id = user.id

    def unlike(self, user):
        if self.is_liked_by(user):
            self.liked_by_users.remove(user)
            self.last_liked_user_id = None

    def is_liked_by(self, user):
        return self.liked_by_users.filter(post_likes.c.user_id == user.id).count() > 0
