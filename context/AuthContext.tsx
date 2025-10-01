import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

// Define the base URL for the API
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/users`;

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    // Always use the latest token from localStorage
    const latestToken = localStorage.getItem('token');
    if (latestToken) {
      setAuthToken(latestToken);
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/me`);
      setUser(res.data);
      setIsAuthenticated(true);
      console.log("User data:", res.data);
      console.log("Is authenticated:", isAuthenticated);
    } catch (err: any) {
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
      console.error("Load User Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, body, config);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      await loadUser(); // Load user data after successful login
    } catch (err: any) {
      // Throw the actual error message from the backend
      const message = err.response?.data?.message || 'Login Failed';
      throw new Error(message);
    }
  };

  const register = async (userData: any) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify(userData);

    try {
      const res = await axios.post(`${API_BASE_URL}/register`, body, config);
      // Log the response to the console
      console.log("Registration Response:", res);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration Failed';
      console.error("Registration Error:", err);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  };

  const value = {
    token,
    isAuthenticated,
    loading,
    user,
    login,
    register,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
