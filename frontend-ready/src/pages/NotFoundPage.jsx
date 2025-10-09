import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">🤔</div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-text">
          Sorry, we couldn't find the page you're looking for. 
          The page might have been moved, deleted, or doesn't exist.
        </p>
        
        <div className="flex gap-4">
          <Button variant="primary" onClick={handleGoHome}>
            Go Home
          </Button>
          <Button variant="secondary" onClick={handleGoBack}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;