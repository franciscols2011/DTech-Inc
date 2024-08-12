import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importar useParams
import { useAuth } from '../auth/AuthContext';
import { getProfile } from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';
import Navbar from './Navbar';

const Profile = () => {
  const { auth, setAuth } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user_id } = useParams(); // Obtener el user_id de la URL
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth || !auth.user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await getProfile(user_id); // Usar el user_id de la URL para obtener el perfil correcto
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('No se pudo cargar el perfil. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [auth, user_id, navigate]); // Añadir user_id como dependencia

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Intentar de nuevo</button>
      </div>
    );
  }

  return (
    <>
      <Navbar handleLogout={handleLogout} handleSearch={handleSearch} />
      <section className="profile gradient-custom vh-100">
        <div className="container-lg py-5" style={{ backgroundColor: '#f7f7f7', borderRadius: '10px', maxWidth: '1100px' }}>
          <div className="profile-header mb-4 d-flex align-items-center justify-content-between">
            <img
              src={profileData.user.avatar}
              className="rounded-circle profile-avatar"
              style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #333' }}
            />
            <div className="flex-grow-1 ms-4 d-flex flex-column align-items-start">
              <p className='fw-bold mb-4' style={{ fontSize: '1.75rem', color: '#333' }}>{`${profileData.user.name} ${profileData.user.surname}`}</p>
              <div className="stats d-flex">
                <p className="me-3" style={{ fontSize: '1.2rem' }}><strong>{profileData.posts.length}</strong> publicaciones</p>
                <p className="me-3" style={{ fontSize: '1.2rem' }}><strong>0</strong> seguidores</p>
                <p style={{ fontSize: '1.2rem' }}><strong>0</strong> seguidos</p>
              </div>
            </div>
          </div>
          <hr />
          <h4 className="text-uppercase text-start mb-4" style={{ marginTop: '40px', color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Posts publicados</h4>
          <div className="row">
            {profileData.posts.length > 0 ? (
              profileData.posts.map((post) => (
                <div key={post.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="post-wrapper">
                    <img
                      src={post.image}
                      alt={post.message}
                      className="img-fluid rounded post-image"
                    />
                    <p className="post-message mt-2"><strong>{post.message}</strong></p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No has creado ningún post aún.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
