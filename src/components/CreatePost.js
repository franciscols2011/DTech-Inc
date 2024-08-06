import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    image: '',
    message: '',
    location: '',
    status: 'published'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost(formData);
      navigate('/posts');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row g-0 d-flex align-items-center h-100">
          <div className="col-lg-4 d-none d-lg-flex">
            <img src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg" alt="Sample" className="w-100 rounded-t-5 rounded-tr-lg-0 rounded-bl-lg-5" />
          </div>
          <div className="col-lg-8">
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
              <div className="card-body py-5 px-md-5 text-center">
                <h2 className="fw-bold mb-2 text-uppercase">Create Post</h2>
                <p className="text-white-50 mb-5">Please enter the details of your post!</p>
                <form onSubmit={handleSubmit}>
                  <div className="form-outline form-white mb-4">
                    <input
                      type="text"
                      id="typeImage"
                      name="image"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="typeImage">Image URL</label>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <textarea
                      id="typeMessage"
                      name="message"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    ></textarea>
                    <label className="form-label" htmlFor="typeMessage">Message</label>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <input
                      type="text"
                      id="typeLocation"
                      name="location"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="typeLocation">Location</label>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <select
                      id="typeStatus"
                      name="status"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    >
                      <option value="published">Published</option>
                      <option value="drafted">Drafted</option>
                      <option value="deleted">Deleted</option>
                    </select>
                    <label className="form-label" htmlFor="typeStatus">Status</label>
                  </div>
                  <button className="btn btn-outline-light btn-lg px-5" type="submit">Create</button>
                </form>
                <p className="mb-0 mt-4">Want to see all posts? <a href="/posts" className="text-white-50 fw-bold">View Posts</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatePost;
