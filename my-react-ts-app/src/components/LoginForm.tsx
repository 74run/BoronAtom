import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav as BootstrapNav, NavDropdown, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../css/LoginForm.css'; // Import your custom CSS file

import logo from './logo-no-background.png';

interface LoginFormProps {
  onLogin: () => void; // Callback function to be called after successful login
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to hold the error message
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { username, password });
      const { userID, token } = response.data;

      onLogin();

      localStorage.setItem('Token', token);
      localStorage.setItem('UserID', userID);

      navigate(`/profile/${userID}`);
    } catch (error: any) {
      console.error('Login error:', error.response?.data?.message || 'Unknown error');
      setError(error.response?.data?.message || 'Unknown error');
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
    <div className="login-page">
      <nav className="navbar navbar-expand-md navbar-light bg-white shadow">
      <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" height="40" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/register">Register</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/forgotpassword">Forgot Password</a>
              </li>
            </ul>
          </div>
        </div>
        </BootstrapNavbar>
      </nav>

    

      <div className="login-container">
        <div className="login-box shadow p-5 rounded">
          <h2 className="text-center mb-4">Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Username*"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <div className="password-input-group input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  placeholder="Password*"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-neutral"
                  onClick={togglePasswordVisibility}
                >
                  <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
              </div>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-lg">
                Login
              </button>
              <button type="button" className="btn btn-link" onClick={handleForgotPasswordClick}>
                Forgot Password?
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>Don't have an account?</p>
            <button type="button" className="btn btn-outline-primary" onClick={handleRegisterClick}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
