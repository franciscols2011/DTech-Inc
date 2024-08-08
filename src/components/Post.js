import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { likePost } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment, faPaperPlane, faBookmark } from '@fortawesome/free-regular-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';
import { useAuth } from '../auth/AuthContext';

const Post = React.forwardRef(({ post }, ref) => {
  const { auth } = useAuth();
  const currentUser = auth?.user?.username;

  // Estados para el manejo de likes y si se debe mostrar la lista de likes
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [showLikes, setShowLikes] = useState(false);

  useEffect(() => {
    // Inicializa el estado "liked" si el usuario ha dado like al post
    if (post.likes && post.likes.includes(currentUser)) {
      setLiked(true);
    }
  }, [post.likes, currentUser]);

  const handleLike = async () => {
    try {
      await likePost(post.id);
      setLiked(!liked);
      if (liked) {
        setLikes(likes.filter((username) => username !== currentUser));
      } else {
        setLikes([currentUser, ...likes]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const timeSinceCreation = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 3600);

    if (interval > 1) {
      return `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `${interval} minutes ago`;
    }
    return `${Math.floor(seconds)} seconds ago`;
  };

  const handleShowLikes = () => {
    setShowLikes(!showLikes);
  };

  return (
    <div className="post card mb-4" ref={ref}>
      <div className="post-header card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Link to={`/user/${post.author.id}`}>
            <img src={post.author.avatar} alt="N/P" className="rounded-circle" width="32" height="32" />
          </Link>
          <Link to={`/user/${post.author.id}`} className="ms-2 text-decoration-none text-dark">
            <span className="fw-bold">{post.author.name} {post.author.surname}</span>
          </Link>
        </div>
        <div>{post.location}</div>
      </div>
      <img src={post.image} alt={post.message} className="post-image card-img-top" />
      <div className="post-footer card-body">
        <div className="post-actions d-flex justify-content-between mb-2 align-items-center">
          <div className="d-flex">
            <button onClick={handleLike} className="btn btn-link p-0 me-3">
              <FontAwesomeIcon icon={liked ? faSolidHeart : faHeart} className={`icon ${liked ? 'text-danger' : ''}`} />
            </button>
            <FontAwesomeIcon icon={faComment} className="icon me-3" />
            <FontAwesomeIcon icon={faPaperPlane} className="icon" />
          </div>
          <FontAwesomeIcon icon={faBookmark} className="icon" />
        </div>
        <div className="post-likes">
          {likes.length === 1 && likes[0] === currentUser && (
            <span>{currentUser} le dio like</span>
          )}
          {likes.length > 1 && (
            <span onClick={handleShowLikes} style={{ cursor: 'pointer' }}>
              {`a ${likes.length} ${likes.length > 1 ? 'personas les gustó la publicación' : 'persona le gustó la publicación'}`}
            </span>
          )}
          {showLikes && (
            <div className="likes-list">
              {likes.map((username) => (
                <div key={username}>{username}</div>
              ))}
            </div>
          )}
        </div>
        <div className="post-caption">
          <p><strong>{post.author.username}</strong> {post.message}</p>
        </div>
        <div className="post-time">
          <small>{timeSinceCreation(post.created_at)}</small>
        </div>
      </div>
    </div>
  );
});

export default Post;
