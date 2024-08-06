import React from 'react';
import { Link } from 'react-router-dom';
import { likePost } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

const Post = React.forwardRef(({ post }, ref) => {
  const handleLike = async () => {
    try {
      await likePost(post.id);
      window.location.reload();
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
        <div className="post-footer-left d-flex align-items-center mb-2">
          <button onClick={handleLike} className="btn btn-link p-0 me-2">❤</button>
          <span>{post.likes.length} likes</span>
        </div>
        <div className="post-footer-right">
          <p><strong>{post.author.username}</strong> {post.message}</p>
          <small>{timeSinceCreation(post.created_at)}</small>
        </div>
      </div>
    </div>
  );
});

export default Post;
