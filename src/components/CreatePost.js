import React, { useState } from 'react';
import { createPost } from '../api';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Autocomplete from 'react-autocomplete';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

const locations = [
  { label: 'Montevideo, Uruguay' },
  { label: 'Buenos Aires, Argentina' },
  { label: 'Santiago, Chile' },
  { label: 'Lima, Perú' },
  { label: 'Bogotá, Colombia' },
  { label: 'Rio de Janeiro, Brazil' },
  { label: 'Madrid, Spain' },
  
];

const CreatePost = () => {
  const [formData, setFormData] = useState({
    image: '',
    message: '',
    location: '',
    status: 'published',
  });
  const [locationValue, setLocationValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (value) => {
    setLocationValue(value);
    setFormData({ ...formData, location: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost(formData);

      if (location.pathname === '/profile') {
        navigate(0); // Recarga la página para mostrar el nuevo post en profile
      } else if (location.pathname === '/posts') {
        navigate('/posts', { replace: true });
      } else {
        navigate('/posts');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row g-0 d-flex align-items-center h-100">
          <div className="col-lg-4 d-none d-lg-flex justify-content-center align-items-center">
            <img 
              src="https://media.sproutsocial.com/uploads/2022/03/Instagram-Carousels.svg" 
              alt="Sample" 
              className="w-75 rounded-t-5 rounded-tr-lg-0 rounded-bl-lg-5 shadow-lg" 
              style={{ marginRight: '30px', maxHeight: '700px' }} 
            />
          </div>
          <div className="col-lg-8">
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
              <div className="card-body py-5 px-md-5 text-center">
                <h2 className="fw-bold mb-2 text-uppercase">Create Post</h2>
                <p className="text-white-50 mb-5">Please enter the details of your post!</p>
                <form onSubmit={handleSubmit}>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="typeImage">Image URL</label>
                    <input
                      type="text"
                      id="typeImage"
                      name="image"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="typeMessage">Message</label>
                    <textarea
                      id="typeMessage"
                      name="message"
                      className="form-control form-control-lg"
                      required
                      onChange={handleChange}
                      style={{ minHeight: '100px' }}
                    ></textarea>
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="typeLocation">Location</label>
                    <Autocomplete
                      getItemValue={(item) => item.label}
                      items={locations}
                      renderItem={(item, isHighlighted) =>
                        <div key={item.label} style={{ background: isHighlighted ? 'lightgray' : 'gray', padding: '5px', width: '100%' }}>
                          {item.label}
                        </div>
                      }
                      value={locationValue}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      onSelect={(val) => handleLocationChange(val)}
                      inputProps={{
                        id: "typeLocation",
                        name: "location",
                        className: "form-control form-control-lg",
                        style: { marginTop: '-10px' },
                        required: true
                      }}
                    />
                  </div>
                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="typeStatus">Status</label>
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
                  </div>
                  <button className="btn btn-outline-light btn-lg px-5" type="submit">Create</button>
                </form>
                <p className="mb-0 mt-4">Want to see all posts? <Link to="/posts" className="text-white-50 fw-bold">View Posts</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatePost;
