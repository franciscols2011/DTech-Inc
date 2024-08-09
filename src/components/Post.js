import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { likePost } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment, faPaperPlane, faBookmark } from '@fortawesome/free-regular-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';
import { useAuth } from '../auth/AuthContext';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const Post = React.forwardRef(({ post }, ref) => {
  const { auth } = useAuth();
  const currentUser = auth?.user?.username;

  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes || []);

  const timeSinceCreation = (dateString) => {
    const postDate = parseISO(dateString);
  
    // Ajustar la diferencia horaria (-3 horas)
    const correctedDate = new Date(postDate.getTime() - 3 * 60 * 60 * 1000);
  
    return formatDistanceToNow(correctedDate, { addSuffix: true, locale: es });
  };

  const [time, setTime] = useState(() => timeSinceCreation(post.created_at));

  useEffect(() => {
    if (post.likes && post.likes.includes(currentUser)) {
      setLiked(true);
    }
  }, [post.likes, currentUser]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(timeSinceCreation(post.created_at));
    }, 60000); 

    return () => clearInterval(intervalId); 
  }, [post.created_at]);

  const handleLike = async () => {
    try {
      const response = await likePost(post.id);
      setLiked(response.data.liked);
      setLikes(response.data.likes);
    } catch (error) {
      console.error(error);
    }
  };

  const lastLikedUser = likes.length > 0 ? likes[0] : null;
  const otherLikesCount = likes.length > 1 ? likes.length - 1 : 0;

  return (
    <div className="post card mb-4" ref={ref}>
      <div className="post-header card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Link to={`/user/${post.author.id}`}>
            <img src={post.author.avatar} alt="N/P" className="rounded-circle" width="32" height="32" />
          </Link>
          <Link to={`/user/${post.author.id}`} className="ms-2 text-decoration-none text-dark">
            <span className="fw-bold">{post.author.name} {post.author.surname}</span>
          </Link>
        </div>
        <div>{post.location}</div>
      </div>
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
            <span>
              {`A ${lastLikedUser} le gustó esta publicación`}
              {otherLikesCount > 0 && ` y a ${otherLikesCount} ${otherLikesCount > 1 ? 'personas más' : 'persona más'}`}
            </span>
          )}
        </div>
        <div className="post-caption">
          <p><strong>{post.author.username}</strong> {post.message}</p>
        </div>
        <div className="post-time">
          <small>{time}</small>
        </div>
      </div>
    </div>
  );
});

export default Post;
