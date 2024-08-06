import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, logout } from '../api';
import Post from './Post';
import { useAuth } from '../auth/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setAuth(null);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="d-flex justify-content-end mb-4">
          <button onClick={handleLogout} className="btn btn-outline-light btn-lg px-5">Logout</button>
        </div>
        <div className="post-list">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
        <div className="create-post text-center mt-4">
          <a href="/create" className="btn btn-outline-light btn-lg px-5">Create Post</a>
        </div>
      </div>
    </section>
  );
};

export default Posts;
