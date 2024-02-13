// frontend/src/components/LoginForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../css/LoginForm.css'; // Import your custom CSS file

// ... (imports and other code)
interface LoginFormProps {
  onLogin: () => void; // Callback function to be called after successful login
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) =>  {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to hold the error message
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', { username, password });
      const { success, message, userID } = response.data;
      setUserId(userID);

      console.log('User ID:', userID);
      console.log('Server Response:', message);
      onLogin();

      sessionStorage.setItem('userId', userID);

      // Dynamically navigate to the dashboard with the username as a parameter
      navigate(`/profile/${userID}`);
    } catch (error: any) {
      console.error('Login error:', error.response.data.message || 'Unknown error');
      setError(error.response.data.message || 'Unknown error'); // Set the error message in state
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgotpassword');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username*"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <div className="password-input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              value={password}
              placeholder='Password*'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn eye-icon-btn"
              onClick={togglePasswordVisibility}
            >
              <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            </button>
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="btn btn-success">
          Login
        </button>
        <button type="button" className="btn btn-primary btn button-gap" onClick={handleForgotPasswordClick}>
          Forgot Password
        </button>
      </form>
      <div className="register-link">
        <p>Don't have an account? </p>
        <button type="button" className="btn btn-outline-primary" onClick={handleRegisterClick}>
          Register
        </button>
      </div>
    </div>
  );
};

export default LoginForm;

