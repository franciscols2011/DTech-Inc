from flask import Flask, request, jsonify, redirect, url_for
from models import db, User, Post, Like
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
app.config.from_object('config.Config')

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    if not data.get('username') or not (3 <= len(data['username']) <= 20):
        return jsonify({"error": "Username must be between 3 and 20 characters"}), 400
    if not data.get('password') or not (5 <= len(data['password']) <= 10):
        return jsonify({"error": "Password must be between 5 and 10 characters"}), 400
    if not data.get('name') or not (3 <= len(data['name']) <= 20):
        return jsonify({"error": "Name must be between 3 and 20 characters"}), 400
    if not data.get('surname') or not (3 <= len(data['surname']) <= 20):
        return jsonify({"error": "Surname must be between 3 and 20 characters"}), 400
    
    user = User(
        avatar=data.get('avatar'),
        name=data['name'],
        surname=data['surname'],
        username=data['username']
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get('username')).first()
    if user is None or not user.check_password(data.get('password')):
        return jsonify({"error": "Invalid username or password"}), 400
    login_user(user)
    return jsonify({"message": "Logged in successfully"}), 200

@app.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200


@app.route('/posts', methods=['POST'])
@login_required
def create_post():
    data = request.json
    if not data.get('image'):
        return jsonify({"error": "Image URL is required"}), 400
    if not data.get('message') or not (10 <= len(data['message']) <= 500):
        return jsonify({"error": "Message must be between 10 and 500 characters"}), 400
    if not data.get('location') or not (4 <= len(data['location']) <= 30):
        return jsonify({"error": "Location must be between 4 and 30 characters"}), 400
    if data.get('status') not in ['drafted', 'deleted', 'published']:
        return jsonify({"error": "Status must be one of 'drafted', 'deleted', or 'published'"}), 400
    
    post = Post(
        image = data['image'],
        message = data['message'],
        author = current_user,
        location = data['location'],
        status = data['status']
        )
    
    db.session.add(post)
    db.session.commit()
    return jsonify({"message": "Post created successfully"}), 201



@app.route('/posts', methods=['GET'])
@login_required
def get_posts():
    posts = Post.query.filter_by(author=current_user.id).order_by(Post.created_at.desc()).all()
    return jsonify([
        {
            'id': posts.id,
            'image': posts.image,
            'message': posts.message,
            'author': {
                'id': posts.author.id,
                'username': posts.author.username,
                'name': posts.author.name,
                'surname': posts.author.surname,
                'avatar': posts.author.avatar
            },
            'created_at': posts.created_at,
            'location': posts.location,
            'status': posts.status,
            'likes': [{'id': user.id, 'username': user.username} for user in posts.likes]
        } for post in posts
    ]), 200
    
@app.route('/like', methods=['POST'])
@login_required
def like_post():
    data = request.json
    post_id = data.get('post_id')
    post = Post.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
        
    if Like.query.filter_by(user_id = current_user.id, post_id = post.id).first():
        return jsonify({"error": "Already liked"}), 400

    like = Like(user_id = current_user.id, post_id = post.id)
    db.session.add(like)
    db.session.commit()
    return jsonify({"message": "Post liked successfully!!"}), 200
    
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)