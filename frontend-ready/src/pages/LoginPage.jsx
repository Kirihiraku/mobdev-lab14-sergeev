import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear auth errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    clearError();

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      navigate('/');
    }
    // Error handling is done automatically by the auth context
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Welcome Back</h1>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            id="username"
            name="username"
            type="text"
            label="Username"
            value={formData.username}
            onChange={handleInputChange}
            error={errors.username}
            required
            placeholder="Enter your username"
            autoComplete="username"
          />
          
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="mt-6"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;