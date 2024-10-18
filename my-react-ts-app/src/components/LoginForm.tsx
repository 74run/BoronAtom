import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
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
  const [expanded, setExpanded] = useState(false); // State to handle navbar expansion
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
    <div
      className="login-page"
      style={{
        backgroundColor: "#1c1c1e",
        minHeight: "100vh",
        color: "#f5f5f5",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow" style={{ borderBottom: "1px solid #333" }}>
        <BootstrapNavbar expand="md" bg="dark" variant="dark" fixed="top" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
          <Container fluid>
            <BootstrapNavbar.Brand href="/" className="d-flex align-items-center">
              <img
                src={logo}
                alt="Logo"
                className="img-fluid"
                style={{
                  height: "25px",
                  width: "auto",
                }}
              />
            </BootstrapNavbar.Brand>
            <BootstrapNavbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={() => setExpanded(!expanded)}
              className="ms-auto"
              style={{
                position: 'relative',
                top: 0,
                marginLeft: 'auto',
              }}
            />
            <BootstrapNavbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/forgotpassword">Forgot Password</Nav.Link>
              </Nav>
            </BootstrapNavbar.Collapse>
          </Container>
        </BootstrapNavbar>
      </nav>

      {/* Login Form */}
      <div className="login-container d-flex justify-content-center align-items-center vh-100">
        <div
          className="login-box shadow-lg p-5 rounded"
          style={{
            backgroundColor: "#2d2d30",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
            padding: "40px",
          }}
        >
          <h2 className="text-center mb-4" style={{ fontFamily: "'Roboto Slab', serif", fontSize: "1.5rem", fontWeight: 700, color: "#4CAF50" }}>
            Welcome Back
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Username or Email*"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  borderRadius: "8px",
                  border: "1px solid #444",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  padding: "12px",
                }}
              />
            </div>
            <div className="mb-4">
              <div className="password-input-group input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  placeholder="Password*"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #444",
                    backgroundColor: "#1c1c1e",
                    color: "#f5f5f5",
                    padding: "12px",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-neutral"
                  onClick={togglePasswordVisibility}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #444",
                    backgroundColor: "#444",
                    color: "#f5f5f5",
                    padding: "0.5rem 1rem",
                  }}
                >
                  <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
                </button>
              </div>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{
                  backgroundColor: "#4CAF50",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  transition: "all 0.3s",
                }}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-link"
                onClick={handleForgotPasswordClick}
                style={{
                  color: "#007bff",
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p>Don't have an account?</p>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleRegisterClick}
              style={{
                borderRadius: "8px",
                padding: "10px 20px",
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
