import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav as BootstrapNav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../css/RegisterForm.css'; // Import your custom CSS file
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

import logo from './logo-no-background.png';

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to hold the error message
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
    } else {
      setError(null);
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^A-Za-z ]/gi, '');
    setFirstName(inputValue);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^A-Za-z ]/gi, '');
    setLastName(inputValue);
  };

  const handleRegister = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/;
    if (!passwordRegex.test(password)) {
      setError('Invalid password. Please follow the password criteria.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, {
        firstName,
        lastName,
        email,
        username,
        password,
        confirmPassword,
      });

      const { data } = response;
      localStorage.setItem('userId', data.userId);

      setError(null);
      navigate('/verifyotp');
    } catch (error: any) {
      setError(error.message || 'Unknown error');
      console.error('Registration error:', error.message || 'Unknown error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateEmail();
    handleRegister();
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-page">
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
                <a className="nav-link" href="/login">Login</a>
              </li>
            </ul>
          </div>
        </div>
      </BootstrapNavbar>

      <div className="register-container">
        <div className="register-box shadow p-5 rounded">
          <h2 className="text-center mb-4">Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="First Name*"
                value={firstName}
                onChange={handleFirstNameChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name*"
                value={lastName}
                onChange={handleLastNameChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                className="form-control"
                placeholder="Email*"
                value={email}
                onChange={handleEmailChange}
                onBlur={validateEmail}
                required
              />
            </div>
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
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                >
                  <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
              </div>
            </div>
            <div className="mb-4">
              <div className="password-input-group input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                  value={confirmPassword}
                  placeholder="Confirm Password*"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
              </div>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-lg">
                Register
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p>Already have an account?</p>
            <button type="button" className="btn btn-outline-primary" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
