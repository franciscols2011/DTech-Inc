import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    avatar: '',
    name: '',
    surname: '',
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');  // Redirect to login after successful registration
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="text-center text-lg-start gradient-custom vh-100">
      <div className="container py-5 h-100">
        <div className="row g-0 d-flex align-items-center h-100">
          <div className="col-lg-4 d-none d-lg-flex">
            <img src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg" alt="Sample" className="w-100 rounded-t-5 rounded-tr-lg-0 rounded-bl-lg-5" />
          </div>
          <div className="col-lg-8">
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
              <div className="card-body py-5 px-md-5">
                <form onSubmit={handleSubmit}>
                  <div className="form-outline form-white mb-4">
                    <input
                      type="text"
                      id="typeAvatar"
                      name="avatar"
                      className="form-control form-control-lg"
                      onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="typeAvatar">Avatar URL</label>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <input
                      type="text"
                      id="typeName"
                      name="name"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="typeName">Name</label>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <input
                      type="text"
                      id="typeSurname"
                      name="surname"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="typeSurname">Surname</label>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <input
                      type="text"
                      id="typeUsername"
                      name="username"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="typeUsername">Username</label>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <input
                      type="password"
                      id="typePassword"
                      name="password"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="typePassword">Password</label>
                  </div>
                  <button type="submit" className="btn btn-outline-light btn-lg px-5">Sign up</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
