import React from 'react';
import { likePost } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';
import moment from 'moment';

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
    <div className="post">
      <div className="post-header">
        <div className="d-flex align-items-center">
          <img src={post.author.avatar} alt="Avatar" />
          <span>{post.author.name} {post.author.surname}</span> 
        </div>
        <div>{post.location}</div>
      </div>
      <img src={post.image} alt={post.message} className="post-image" />
      <div className="post-footer">
        <div className="post-footer-left">
          <button onClick={handleLike}>❤</button>
          <span>{post.likes.length} likes</span>
        </div>
        <div className="post-footer-right">
          <p><strong>{post.author.username}</strong> {post.message}</p> 
          <small>{moment(post.created_at).fromNow()}</small>
        </div>
      </div>
    </div>
  );
};

export default Post;
