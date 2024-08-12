from flask import Blueprint, request, jsonify
from models import db, User, Post
from flask_login import login_user, logout_user, current_user, login_required
from sqlalchemy.orm import subqueryload
import logging

api = Blueprint('api', __name__)

@api.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json(force=True)
        if not data:
            raise ValueError("No JSON data received")

        password = data.get('password')
        if not password or len(password) < 5 or len(password) > 10:
            raise ValueError("Password must be between 5 and 10 characters")

        user = User(
            avatar=data.get('avatar'),
            username=data.get('username'),
            name=data.get('name'),
            surname=data.get('surname')
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except ValueError as e:
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
            # Devolver los datos del usuario aquí
            return jsonify({
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "name": user.name,
                    "surname": user.surname,
                    "avatar": user.avatar
                }
            }), 200
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
        post = Post(
            image=data.get('image'),
            message=data.get('message'),
            author_id=current_user.id,
            location=data.get('location'),
            status=data.get('status')
        )
        db.session.add(post)
        db.session.commit()
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

        query = Post.query.options(subqueryload(Post.liked_by_users)).filter(Post.location.ilike(f'%{search_term}%'))

        if order == 'oldest':
            posts = query.order_by(Post.created_at.asc()).all()
        else:
            posts = query.order_by(Post.created_at.desc()).all()

        result = []
        for post in posts:
            liked_by_usernames = [user.username for user in post.liked_by_users]
            liked = current_user.username in liked_by_usernames

            result.append({
                "id": post.id,
                "image": post.image,
                "message": post.message,
                "author": {
                    "id": post.author.id,
                    "username": post.author.username,
                    "name": post.author.name,
                    "surname": post.author.surname,
                    "avatar": post.author.avatar
                },
                "created_at": post.created_at.isoformat(),
                "location": post.location,
                "status": post.status,
                "likes_count": len(liked_by_usernames),
                "likes": [{"id": user.id, "username": user.username} for user in post.liked_by_users],
                "liked": liked
            })

        return jsonify(result), 200
    except Exception as e:
        logging.error(f"Error during fetching posts: {e}")
        return jsonify({"error": str(e)}), 500

@api.route('/like', methods=['POST'])
@login_required
def like_post():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"error": "Post not found"}), 404

        if post.is_liked_by(current_user):
            post.unlike(current_user)
            message = "Post unliked successfully"
            liked = False
        else:
            post.like(current_user)
            message = "Post liked successfully"
            liked = True

        db.session.commit()

        # Devuelve la lista de usuarios que han dado like, incluyendo su nombre de usuario y su ID
        likes = [{"id": user.id, "username": user.username} for user in post.liked_by_users]

        return jsonify({
            "message": message,
            "likes": likes,
            "likes_count": len(likes),
            "liked": liked
        }), 200
    except Exception as e:
        logging.error(f"Error during liking post: {e}")
        return jsonify({"error": str(e)}), 500




@api.route('/profile/<int:user_id>', methods=['GET'])
@login_required
def get_profile(user_id):
    try:
        user = User.query.get_or_404(user_id)
        posts = Post.query.filter_by(author_id=user.id).order_by(Post.created_at.desc()).all()

        result = {
            "user": {
                "id": user.id,
                "avatar": user.avatar,
                "username": user.username,
                "name": user.name,
                "surname": user.surname,
            },
            "posts": [{
                "id": post.id,
                "image": post.image,
                "message": post.message,
                "created_at": post.created_at.isoformat(),
                "location": post.location,
                "status": post.status,
                "likes_count": len(post.liked_by_users),  # Uso de len() para contar los likes
                "liked": current_user in post.liked_by_users
            } for post in posts]
        }

        return jsonify(result), 200
    except Exception as e:
        logging.error(f"Error during fetching profile: {e}")
        return jsonify({"error": str(e)}), 500