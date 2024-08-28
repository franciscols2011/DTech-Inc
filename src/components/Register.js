import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';

const Register = () => {
  const [formData, setFormData] = useState({ avatar: '', name: '', surname: '', username: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.username || formData.username.length < 3 || formData.username.length > 20) {
      formErrors.username = "Username must be between 3 and 20 characters";
    }
    if (!formData.password || formData.password.length < 5 || formData.password.length > 10) {
      formErrors.password = "Password must be between 5 and 10 characters";
    }
    if (!formData.name || formData.name.length < 3 || formData.name.length > 20) {
      formErrors.name = "Name must be between 3 and 20 characters";
    }
    if (!formData.surname || formData.surname.length < 3 || formData.surname.length > 20) {
      formErrors.surname = "Surname must be between 3 and 20 characters";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await register(formData);
        navigate('/login');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5 text-center">
                <h3 className="mb-5">Register</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-outline form-white mb-4">
                  <label className="form-label" htmlFor="typeAvatar">Avatar</label>
                    <input
                      type="text"
                      id="typeAvatar"
                      name="avatar"
                      className="form-control form-control-lg"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-outline form-white mb-4">
                  <label className="form-label" htmlFor="typeName">Name</label>
                    <input
                      type="text"
                      id="typeName"
                      name="name"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    />
                    {errors.name && <span className="text-danger">{errors.name}</span>}
                  </div>
                  <div className="form-outline form-white mb-4">
                  <label className="form-label" htmlFor="typeSurname">Surname</label>
                    <input
                      type="text"
                      id="typeSurname"
                      name="surname"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    />
                    {errors.surname && <span className="text-danger">{errors.surname}</span>}
                  </div>
                  <div className="form-outline form-white mb-4">
                  <label className="form-label" htmlFor="typeUsername">Username</label>
                    <input
                      type="text"
                      id="typeUsername"
                      name="username"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    />
                    {errors.username && <span className="text-danger">{errors.username}</span>}
                  </div>
                  <div className="form-outline form-white mb-4">
                  <label className="form-label" htmlFor="typePassword">Password</label>
                    <input
                      type="password"
                      id="typePassword"
                      name="password"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    />
                    {errors.password && <span className="text-danger">{errors.password}</span>}
                  </div>
                  <button className="btn btn-outline-light btn-lg px-5" type="submit">Sign up</button>
                </form>
                <p className="mt-3">Already have an account? <Link to="/login">Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
