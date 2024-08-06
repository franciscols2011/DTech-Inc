import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, logout } from '../api';
import Post from './Post';
import { useAuth } from '../auth/AuthContext';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const observer = useRef();

  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await getPosts({ order, searchTerm });
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  }, [order, searchTerm]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleOrderChange = () => {
    setOrder(order === 'newest' ? 'oldest' : 'newest');
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuth(null);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const lastPostElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchPosts]
  );

  return (
    <>
      <Navbar handleLogout={handleLogout} handleSearch={handleSearch} />
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="d-flex justify-content-end mb-4">
            <button onClick={handleOrderChange} className="btn btn-outline-light btn-lg px-5">
              {order === 'newest' ? 'Show older' : 'Show most recent'}
            </button>
          </div>
          <div className="post-list">
            {posts.map((post, index) => (
              <Post key={post.id} post={post} ref={index === posts.length - 1 ? lastPostElementRef : null} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Posts;
