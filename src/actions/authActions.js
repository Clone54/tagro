console.log("AuthActions file version: 2.0"); // Add this line
import axios from 'axios';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT
} from './types';
// Note: Ensure you have an alertActions.js file for this import to work
// import { setAlert } from './alertActions'; 
import setAuthToken from '../utils/setAuthToken';

// Define the base API URL using your environment variable
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/users`;

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    // Use the API_BASE_URL variable
    const res = await axios.get(`${API_BASE_URL}/me`);

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const registerUser = ({ name, email, password, phone }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, email, password, phone });

  try {
    // Use the API_BASE_URL variable
    const res = await axios.post(`${API_BASE_URL}/register`, body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    // Login the user directly after registration
    // Vercel might require you to return a token on register for this to work
    // For now, we'll just indicate success.
    // dispatch(loadUser()); 

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      // errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      console.error(errors);
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};


// Login User
export const loginUser = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        // Use the API_BASE_URL variable
        const res = await axios.post(`${API_BASE_URL}/login`, body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            // errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
            console.error(errors);
        }

        dispatch({
            type: LOGIN_FAIL
        });
    }
};

// Logout
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};

