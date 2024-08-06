from flask import Blueprint, request, jsonify
from models import db, User, Post
from flask_login import login_user, logout_user, current_user, login_required
import logging

api = Blueprint('api', __name__)

@api.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json(force=True)
        logging.debug(f"Received JSON data: {data}")

        if not data:
            raise ValueError("No JSON data received")

        user = User(
            avatar=data.get('avatar'),
            username=data.get('username'),
            name=data.get('name'),
            surname=data.get('surname')
        )
        user.set_password(data.get('password'))
        db.session.add(user)
        db.session.commit()
        logging.debug(f"User {user.username} registered successfully.")
        return jsonify({"message": "User registered successfully"}), 201

    except ValueError as e:
        logging.error(f"Value error: {e}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logging.error(f"Error during registration: {e}")
        return jsonify({"error": str(e)}), 500

@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        logging.debug(f"Received JSON data: {data}")

        user = User.query.filter_by(username=data.get('username')).first()
        if user and user.check_password(data.get('password')):
            login_user(user)
            return jsonify({"message": "Logged in successfully"}), 200
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        logging.error(f"Error during login: {e}")
        return jsonify({"error": str(e)}), 500

@api.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

@api.route('/posts', methods=['POST'])
@login_required
def create_post():
    try:
        data = request.get_json()
        logging.debug(f"Received JSON data: {data}")

        post = Post(
            image=data.get('image'),
            message=data.get('message'),
            author_id=current_user.id,
            location=data.get('location'),
            status=data.get('status')
        )
        db.session.add(post)
        db.session.commit()
        logging.debug(f"Post created successfully.")
        return jsonify({"message": "Post created successfully"}), 201
    except Exception as e:
        logging.error(f"Error during creating post: {e}")
        return jsonify({"error": str(e)}), 500

@api.route('/posts', methods=['GET'])
@login_required
def get_posts():
    try:
        order = request.args.get('order', 'newest')
        search_term = request.args.get('searchTerm', '')
        logging.debug(f"Order received: {order}, Search term received: {search_term}")

        query = Post.query.filter(Post.location.ilike(f'%{search_term}%'))

        if order == 'oldest':
            posts = query.order_by(Post.created_at.asc()).all()
        else:
            posts = query.order_by(Post.created_at.desc()).all()

        return jsonify([{
            "id": post.id,
            "image": post.image,
            "message": post.message,
            "author": {
                "username": post.author.username,
                "name": post.author.name,
                "surname": post.author.surname,
                "avatar": post.author.avatar
            },
            "created_at": post.created_at,
            "location": post.location,
            "status": post.status,
            "likes": [user.username for user in post.liked_by]
        } for post in posts]), 200
    except Exception as e:
        logging.error(f"Error during fetching posts: {e}")
        return jsonify({"error": str(e)}), 500




@api.route('/like', methods=['POST'])
@login_required
def like_post():
    try:
        data = request.get_json()
        logging.debug(f"Received JSON data: {data}")

        post_id = data.get('post_id')
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"error": "Post not found"}), 404
        if current_user in post.liked_by:
            post.liked_by.remove(current_user)
            message = "Post unliked successfully"
        else:
            post.liked_by.append(current_user)
            message = "Post liked successfully"
        db.session.commit()
        return jsonify({"message": message}), 200
    except Exception as e:
        logging.error(f"Error during liking post: {e}")
        return jsonify({"error": str(e)}), 500

@api.route('/test', methods=['GET'])
def test():
    return "Hola Mundo", 200

@api.route('/search', methods=['GET'])
@login_required
def search_posts():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify([]), 200

        posts = Post.query.join(User).filter(
            (Post.message.ilike(f'%{query}%')) | 
            (User.name.ilike(f'%{query}%')) | 
            (User.surname.ilike(f'%{query}%'))
        ).order_by(Post.created_at.desc()).all()

        return jsonify([{
            "id": post.id,
            "image": post.image,
            "message": post.message,
            "author": {
                "username": post.author.username,
                "name": post.author.name,
                "surname": post.author.surname,
                "avatar": post.author.avatar
            },
            "created_at": post.created_at,
            "location": post.location,
            "status": post.status,
            "likes": [user.username for user in post.liked_by]
        } for post in posts]), 200
    except Exception as e:
        logging.error(f"Error during fetching posts: {e}")
        return jsonify({"error": str(e)}), 500



