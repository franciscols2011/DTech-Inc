import React from 'react';
import { likePost } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

const Post = ({ post }) => {
  const handleLike = async () => {
    try {
      await likePost(post.id);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="post card mb-4">
      <div className="post-header card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src={post.author.avatar} alt="N/P" />
          <span>{post.author.name} {post.author.surname}</span>
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
          <small>{new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
        </div>
      </div>
    </div>
  );
};

export default Post;
