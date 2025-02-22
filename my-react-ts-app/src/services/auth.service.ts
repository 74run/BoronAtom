import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const AuthService = {
  // ... other methods ...

  googleLogin: async () => {
    try {
      // Get the Google OAuth URL from backend
      const response = await axios.get(`${API_URL}/auth/google/url`);
      // Redirect to Google login
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to initiate Google login:', error);
      throw error;
    }
  },

  handleAuthCallback: async (token: string, userId: string) => {
    if (token && userId) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      return { token, userId };
    }
    throw new Error('Invalid authentication response');
  }
}; 