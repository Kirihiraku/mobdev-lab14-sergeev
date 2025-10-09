import { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi, apiUtils } from '../services/api';

// Initial auth state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Auth actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER_START: 'LOAD_USER_START',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
    case AUTH_ACTIONS.LOAD_USER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };

    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
    case AUTH_ACTIONS.LOAD_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload.error
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = apiUtils.getAuthToken();
      if (token) {
        try {
          dispatch({ type: AUTH_ACTIONS.LOAD_USER_START });
          const userData = await authApi.getMe();
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
            payload: { user: userData.user }
          });
        } catch (error) {
          console.error('Failed to load user:', error);
          // Clear invalid token
          apiUtils.clearAuthToken();
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER_FAILURE,
            payload: { error: 'Session expired' }
          });
        }
      } else {
        // No token, set loading to false
        dispatch({
          type: AUTH_ACTIONS.LOAD_USER_FAILURE,
          payload: { error: null }
        });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      const response = await authApi.login(username, password);
      
      // Store token
      apiUtils.setAuthToken(response.token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token
        }
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message }
      });
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (username, password, email) => {
    try {
      dispatch({ type: AUTH_ACTIONS.REGISTER_START });
      
      const response = await authApi.register(username, password, email);
      
      // Store token
      apiUtils.setAuthToken(response.token);
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: {
          user: response.user,
          token: response.token
        }
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: { error: error.message }
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    apiUtils.clearAuthToken();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;