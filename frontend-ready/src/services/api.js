// API Service for backend communication
const API_BASE_URL = 'http://localhost:3001';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Authentication API
export const authApi = {
  // Register new user
  register: async (username, password, email) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, email })
    });
    return handleResponse(response);
  },

  // Login user
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  },

  // Get current user info (protected)
  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Messages API
export const messagesApi = {
  // Get all messages (public)
  getAllMessages: async () => {
    const response = await fetch(`${API_BASE_URL}/api/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  // Create new message (protected)
  createMessage: async (content) => {
    const response = await fetch(`${API_BASE_URL}/api/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    return handleResponse(response);
  },

  // Delete message (protected)
  deleteMessage: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Like/unlike message (protected)
  likeMessage: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/messages/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Report message (protected)
  reportMessage: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/messages/${id}/report`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Stats API
export const statsApi = {
  // Get app statistics (public)
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }
};

// Utility functions
export const apiUtils = {
  // Set auth token in localStorage
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  },

  // Get auth token from localStorage
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },

  // Clear auth token
  clearAuthToken: () => {
    localStorage.removeItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// Default export with all APIs
const api = {
  auth: authApi,
  messages: messagesApi,
  stats: statsApi,
  utils: apiUtils
};

export default api;