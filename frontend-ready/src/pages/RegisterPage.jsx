import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
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

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    const result = await register(
      formData.username.trim(),
      formData.password,
      formData.email.trim()
    );
    
    if (result.success) {
      navigate('/');
    }
    // Error handling is done automatically by the auth context
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Create Account</h1>
        
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
            placeholder="Choose a username"
            autoComplete="username"
          />
          
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
            placeholder="Enter your email"
            autoComplete="email"
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
            placeholder="Create a password"
            autoComplete="new-password"
          />
          
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            required
            placeholder="Confirm your password"
            autoComplete="new-password"
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;