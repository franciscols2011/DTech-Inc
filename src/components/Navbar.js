import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({ handleLogout, handleSearch }) => {
  const location = useLocation(); // Para obtener la ruta actual

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Dtech Inc</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className={`nav-item ${location.pathname === '/posts' ? 'active' : ''}`}>
              <Link className="nav-link" to="/posts">Posts</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/create' ? 'active' : ''}`}>
              <Link className="nav-link" to="/create">Create Post</Link>
            </li>
          </ul>
          <form className="d-flex">
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="Search" 
              aria-label="Search" 
              onChange={(e) => handleSearch(e.target.value)} 
            />
            <button 
              className="btn btn-outline-danger" 
              onClick={handleLogout} 
              type="button"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
