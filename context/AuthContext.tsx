import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken'; // You will need this utility

// 1. DEFINE THE CORRECT BASE URL
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/users`;

// Define the shape of the context
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: any; // Define a proper user type if you have one
  login: (email, password) => Promise<void>;
  register: (userData) => Promise<void>;
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
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get(`${API_BASE_URL}/me`);
        setUser(res.data);
        setIsAuthenticated(true);
    } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
    } finally {
        setLoading(false);
    }
  };

  // 2. IMPLEMENT THE LOGIN FUNCTION CORRECTLY
  const login = async (email, password) => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
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

  // 3. IMPLEMENT THE REGISTER FUNCTION CORRECTLY
  const register = async (userData) => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    };
    const body = JSON.stringify(userData);

    try {
      // The backend should return a token upon successful registration
      await axios.post(`${API_BASE_URL}/register`, body, config);
      // After successful registration, you can either log them in automatically
      // or prompt them to log in. Here we assume you want them to log in.
    } catch (err: any) {
      // Throw the actual error message from the backend
      const message = err.response?.data?.message || 'Registration Failed';
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
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

