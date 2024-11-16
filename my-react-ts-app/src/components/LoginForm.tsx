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
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false); // Navbar expansion state
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
    <div className="login-page" style={{ minHeight: "100vh", color: "#f5f5f5", fontFamily: "'Roboto', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div className="background-wrapper">
        <div className="background-gradient"></div>
        <div className="particles-layer-1"></div>
        <div className="particles-layer-2"></div>
        <div className="particles-layer-3"></div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-md navbar-dark bg-dark shadow" style={{ borderBottom: "1px solid #333" }}>
        <BootstrapNavbar expand="md" bg="dark" variant="dark" fixed="top" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
          <Container fluid>
            <BootstrapNavbar.Brand href="/" className="d-flex align-items-center">
              <img
                src={logo}
                alt="Logo"
                className="img-fluid"
                style={{ height: "25px", width: "auto" }}
              />
            </BootstrapNavbar.Brand>
            <BootstrapNavbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={() => setExpanded(!expanded)}
              className="ms-auto"
              style={{ position: 'relative', top: 0, marginLeft: 'auto' }}
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
      <div className="login-container d-flex justify-content-center align-items-center vh-100" style={{ paddingTop: "80px" }}>
        <div
          className="login-box shadow-lg p-5 rounded"
          style={{
            backgroundColor: "#2d2d30",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "400px",
            padding: "40px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
            color: "#f5f5f5",
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
      <style>{`
        .background-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }
        .background-gradient {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(158,92,236,0.2) 0%, rgba(30,82,153,0.2) 45%, rgba(29,39,54,0.2) 100%);
          animation: rotateGradient 30s linear infinite;
          transform-origin: center;
        }
        .particles-layer-1,
        .particles-layer-2,
        .particles-layer-3 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 60px 60px;
          opacity: 0.3;
        }
        .particles-layer-1 {
          background: radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px);
          animation: animateParticles 25s linear infinite;
        }
        .particles-layer-2 {
          background: radial-gradient(circle, rgba(158,92,236,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: animateParticles 20s linear infinite reverse;
        }
        .particles-layer-3 {
          background: radial-gradient(circle, rgba(30,82,153,0.1) 1px, transparent 1px);
          background-size: 80px 80px;
          animation: animateParticles 30s linear infinite;
        }
        @keyframes rotateGradient {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
        @keyframes animateParticles {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100%, -100%); }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
