import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { likePost } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment, faPaperPlane, faBookmark } from '@fortawesome/free-regular-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

const Post = React.forwardRef(({ post }, ref) => {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = async () => {
    try {
      const response = await likePost(post.id);
      setLiked(!liked);
      if (liked) {
        setLikes(likes.filter((username) => username !== response.data.last_liked_by));
      } else {
        setLikes([response.data.last_liked_by, ...likes]);
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
          <span>
            {likes[0]} and {likes.length - 1} others liked this
          </span>
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
