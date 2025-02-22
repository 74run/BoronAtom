import axios from 'axios';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '../config/auth.config';

const API_URL = process.env.REACT_APP_API_URL;

export const AuthService = {
  // Regular login
  login: async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Google OAuth
  googleLogin: async () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile&prompt=select_account`;
    window.location.href = googleAuthUrl;
  },

  // Handle Google OAuth callback
  handleGoogleCallback: async (code: string) => {
    const response = await axios.post(`${API_URL}/auth/google/callback`, { code });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
};