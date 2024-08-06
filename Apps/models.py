from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

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
    posts = db.relationship('Post', backref='author', lazy=True)
    liked_posts = db.relationship('Post', secondary=post_likes, backref=db.backref('liked_by', lazy='dynamic'))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(255), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    location = db.Column(db.String(30), nullable=False)
    status = db.Column(db.String(10), nullable=False)
