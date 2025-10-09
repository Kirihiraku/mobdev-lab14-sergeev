import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Feedback Wall
        </Link>
        
        {isAuthenticated && (
          <ul className="navbar-nav">
            <li>
              <Link 
                to="/" 
                className={`navbar-link ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/my-messages" 
                className={`navbar-link ${isActive('/my-messages') ? 'active' : ''}`}
              >
                My Messages
              </Link>
            </li>
          </ul>
        )}
        
        {isAuthenticated && user && (
          <div className="navbar-user">
            <span className="navbar-username">
              Welcome, {user.username}
            </span>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;