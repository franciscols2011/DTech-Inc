from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table
from sqlalchemy.orm import validates, relationship

db = SQLAlchemy()

# Tabla de asociación para la relación many-to-many entre User y Post para los "likes"
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
    
    # Relación uno-a-muchos con Post (un usuario puede crear múltiples posts)
    posts = db.relationship('Post', backref='author', lazy=True, cascade="all, delete-orphan")
    
    # Relación muchos-a-muchos con Post para los "likes"
    liked_posts = db.relationship('Post', secondary=post_likes, back_populates='liked_by_users')

    @validates('username')
    def validate_username(self, key, username):
        assert len(username) >= 3 and len(username) <= 20, "Username must be between 3 and 20 characters."
        return username

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

    # Relación muchos-a-muchos con User para los "likes"
    liked_by_users = db.relationship('User', secondary=post_likes, back_populates='liked_posts')

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
    
    # Métodos de la clase Post para manejar los likes
    def like(self, user):
        if not self.is_liked_by(user):
            self.liked_by_users.append(user)

    def unlike(self, user):
        if self.is_liked_by(user):
            self.liked_by_users.remove(user)

    def is_liked_by(self, user):
        return user in self.liked_by_users
