import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, createPost, logout } from '../api';
import Post from './Post';
import { useAuth } from '../auth/AuthContext';
import Navbar from './Navbar';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    image: '',
    message: '',
    location: '',
    status: 'published'
  });
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

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost(formData);
      handleClose();
      fetchPosts(); // Refresh the post list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar handleLogout={handleLogout} handleSearch={handleSearch} />
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="d-flex justify-content-between mb-4">
            <button onClick={handleOrderChange} className="btn btn-outline-light btn-lg px-5">
              {order === 'newest' ? 'Show Oldest' : 'Show Newest'}
            </button>
            <Button variant="primary" onClick={handleShow}>
              Create Post
            </Button>
          </div>
          <div className="post-list">
            {posts.map((post, index) => (
              <Post key={post.id} post={post} ref={index === posts.length - 1 ? lastPostElementRef : null} />
            ))}
          </div>
        </div>
      </section>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formImage">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="published">Published</option>
                <option value="drafted">Drafted</option>
                <option value="deleted">Deleted</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Posts;
