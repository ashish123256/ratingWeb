import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../api/api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        const response = await authAPI.verifyToken();
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('token');
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    verifyAuth();
  }, []);

  const signin = async (email, password) => {
    try {
      const response = await authAPI.signin({ email, password });
      localStorage.setItem('token', response.data.accessToken);
      setAuthState({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const signup = async (userData) => {
    try {
      await authAPI.signup(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signin,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
