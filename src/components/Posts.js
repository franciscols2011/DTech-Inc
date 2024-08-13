import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { getPosts, logout } from '../api';
import Post from './Post';
import { useAuth } from '../auth/AuthContext';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import '../styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const observer = useRef();

  // Función para obtener los posts desde la API
  const fetchPosts = useCallback(async () => {
    try {
      const { data } = await getPosts({ order, searchTerm });
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [order, searchTerm]);

  // Llamar a fetchPosts cada vez que la orden o el término de búsqueda cambien
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
    fetchPosts(); // Volver a obtener los posts con el nuevo orden
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchPosts(); // Volver a obtener los posts con el término de búsqueda
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAuth(null);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Configurar el observador para cargar más posts cuando el último post sea visible
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

  // Redirigir a login si no está autenticado
  if (!auth || !auth.user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar 
        handleLogout={handleLogout} 
        handleSearch={handleSearch} 
        handleOrderChange={handleOrderChange} // Pasar handleOrderChange al Navbar
      />
      <section className="vh-100 gradient-custom">
        <div className="container">
          <div className="d-flex justify-content-between mb-4">
            <div className="dropdown ms-auto">
              <button
                className="btn btn-outline-light dropdown-toggle" 
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FontAwesomeIcon icon={faFilter} /> Filter
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                  <button className="dropdown-item" onClick={() => handleOrderChange('newest')}>
                    Filter by Newest
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleOrderChange('oldest')}>
                    Filter by Oldest
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="post-list">
            {posts.map((post, index) => (
              <Post
                key={post.id}
                post={post}
                ref={index === posts.length - 1 ? lastPostElementRef : null}
                liked={post.liked}
                likesCount={post.likes_count}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Posts;
