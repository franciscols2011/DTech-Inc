import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts({ order, searchTerm });
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [order, searchTerm]);

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

  return (
    <>
      <Navbar handleLogout={handleLogout} handleSearch={handleSearch} />
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="d-flex justify-content-end mb-4">
            <button onClick={handleOrderChange} className="btn btn-outline-light btn-lg px-5">
              {order === 'newest' ? 'Mostrar más antiguos' : 'Mostrar más recientes'}
            </button>
          </div>
          <div className="post-list">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Posts;
