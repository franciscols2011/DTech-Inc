import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { likePost, deletePost, updatePost } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment, faPaperPlane, faBookmark } from '@fortawesome/free-regular-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';
import { useAuth } from '../auth/AuthContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const Post = React.forwardRef(({ post, onDelete, onUpdate }, ref) => {
  const { auth } = useAuth();
  const currentUser = auth?.user?.username;

  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes || []);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState(post.message);
  const [updatedLocation, setUpdatedLocation] = useState(post.location);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  // Calcular el tiempo desde la creación del post
  const timeSinceCreation = (dateString) => {
    const postDate = parseISO(dateString);
    const correctedDate = new Date(postDate.getTime() - 3 * 60 * 60 * 1000);
    return formatDistanceToNow(correctedDate, { addSuffix: true, locale: es });
  };

  const [time, setTime] = useState(() => timeSinceCreation(post.created_at));

  useEffect(() => {
    if (post.likes && post.likes.map(like => like.username).includes(currentUser)) {
      setLiked(true);
    }
  }, [post.likes, currentUser]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(timeSinceCreation(post.created_at));
    }, 60000);

    return () => clearInterval(intervalId);
  }, [post.created_at]);

  // Manejo de clics fuera del menú para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLike = async () => {
    try {
      const response = await likePost(post.id);
      setLiked(response.data.liked);
      setLikes(response.data.likes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      onDelete(post.id);  // Notifica al componente padre que el post ha sido eliminado
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await updatePost(post.id, {
        message: updatedMessage,
        location: updatedLocation,
      });
      onUpdate(response.data); // Notifica al componente padre que el post ha sido actualizado
      setIsEditing(false); // Salir del modo de edición
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const lastLikedUser = likes.length > 0 ? likes[0] : null;
  const otherLikesCount = likes.length > 1 ? likes.length - 1 : 0;

  return (
    <div className="post card mb-4" ref={ref}>
      <div className="post-header card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Link to={`/profile/${post.author.id}`}>
            <img src={post.author.avatar} alt="N/P" className="rounded-circle" width="32" height="32" />
          </Link>
          <Link to={`/profile/${post.author.id}`} className="ms-2 text-decoration-none text-dark">
            <span className="fw-bold">{post.author.name} {post.author.surname}</span>
          </Link>
        </div>
        <div className="d-flex align-items-center position-relative">
          <span>{post.location}</span>
          {/* Solo muestra el botón de menú si el usuario actual es el autor del post */}
          {currentUser === post.author.username && (
            <>
              <button className="btn btn-link ms-2" onClick={() => setShowMenu(!showMenu)}>
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
              {showMenu && (
                <div className="post-menu show-menu" ref={menuRef}>
                  <button className="dropdown-item" onClick={() => setIsEditing(true)}>Edit</button>
                  <button className="dropdown-item" onClick={handleDelete}>Eliminar</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="post-edit card-body">
          <textarea
            className="form-control mb-2"
            value={updatedMessage}
            onChange={(e) => setUpdatedMessage(e.target.value)}
            rows="3"
          />
          <input
            type="text"
            className="form-control mb-2"
            value={updatedLocation}
            onChange={(e) => setUpdatedLocation(e.target.value)}
          />
          <button className="btn btn-success me-2" onClick={handleUpdate}>Save</button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <img src={post.image} alt={post.message} className="post-image card-img-top" />
          <div className="post-footer card-body">
            <div className="post-actions d-flex justify-content-between mb-2 align-items-center">
              <div className="d-flex">
                <button onClick={handleLike} className="btn btn-link p-0 me-3">
                  <FontAwesomeIcon icon={liked ? faSolidHeart : faHeart} className={`icon ${liked ? 'text-danger' : ''}`} />
                </button>
                <FontAwesomeIcon icon={faComment} className="icon me-3" />
                <FontAwesomeIcon icon={faPaperPlane} className="icon" />
              </div>
              <FontAwesomeIcon icon={faBookmark} className="icon" />
            </div>
            <div className="post-likes">
              {lastLikedUser && (
                <Link to={`/profile/${lastLikedUser.id}`} className="text-decoration-none text-dark">
                  {` ${lastLikedUser.username} liked `}
                  {otherLikesCount > 0 && ` and ${otherLikesCount} ${otherLikesCount > 1 ? 'peoples more' : 'people more'}`}
                </Link>
              )}
            </div>
            <div className="post-caption">
              <p>
                <Link to={`/profile/${post.author.id}`} className="text-decoration-none text-dark fw-bold">
                  {post.author.username}
                </Link> 
                {' '}{post.message}
              </p>
            </div>
            <div className="post-time">
              <small>{time}</small>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default Post;
