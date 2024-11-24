import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/RegisterForm.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from './logo-no-background.png';
import PasswordCriteria from './PasswordCriteria';

import back from './unnamed-1.png'

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, {
        firstName,
        lastName,
        email,
        username,
        password,
        confirmPassword,
      });

      const { data } = response;

      if (data.success) {
        localStorage.setItem('userId', data.userId);
        navigate('/verifyOTP');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Unknown error occurred. Please try again.');
      }
      console.error('Registration error:', error.response?.data?.message || error.message || 'Unknown error');
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

  const isPasswordMatch = () => password === confirmPassword && confirmPassword !== '';

  return (

   <>

<style>{`
    body {
            margin: 0;
            font-family: 'Roboto', sans-serif;
            background: url(${back}) no-repeat center center fixed;
            background-size: cover;
        }
    .navbar-1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 50px;
        }
        .navbar-1 .logo {
            display: flex;
            align-items: center;
        }
        .navbar-1 .logo img {
            width: 40px;
            margin-right: 10px;
        }
        .navbar-1 .logo span {
            color: white;
            font-size: 24px;
            font-weight: 700;
        }
        .navbar-1 ul {
            list-style: none;
            display: flex;
            margin: 0;
            padding: 0;
        }
        .navbar-1 ul li {
            margin: 0 15px;
        }
        .navbar-1 ul li a {
            color: white;
            text-decoration: none;
            font-size: 18px;
        }
        .navbar-1 .login-btn {
            background: white;
            color: black;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 500;
            transition: background 0.3s ease, color 0.3s ease;
        }
        .navbar-1 .login-btn:hover {
            background: #00bcd4;
            color: white;
        }
        `}</style>

    <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"></link>

    </head>
    
      {/* Background */}
      <div className="background-wrapper">
        <div className="background-gradient"></div>
        <div className="particles-layer-1"></div>
        <div className="particles-layer-2"></div>
        <div className="particles-layer-3"></div>
      </div>

      {/* Navbar
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
      </nav> */}

      <div className="navbar-1">
   <div className="logo">
   <Link to="/">
   <img 
                src={logo}
                alt="Logo"
                className="img-fluid"
                style={{ height: "25px", width: "auto" }}
              />  
              </Link> </div>
  
   <a className="login-btn" onClick={handleLoginClick}  style={{ cursor: 'pointer' }}>
    Sign in
   </a>
  </div>
    
    
    
      {/* <BootstrapNavbar bg="dark" variant="dark" fixed="top" className="custom-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" style={{
                  height: "25px",
                  width: "auto",
                }} />
          </a>
        </div>
      </BootstrapNavbar> */}

<div className="flex items-center justify-center min-h-screen" style={{ paddingTop: "0px", backgroundPosition: "center", display:'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-md"
          style={{
            backgroundColor: 'rgba(31, 41, 55, 0.75)', // bg-gray-800 with bg-opacity-75
            padding: '2rem', // p-8
            borderRadius: '0.5rem', // rounded-lg
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)', // shadow-lg
            width: '100%', // w-full
            maxWidth: '28rem', // max-w-md
          }}
        >
      <h2 className="text-3xl font-bold mb-6 text-center"
      style={{
        fontSize: '1.875rem', // text-3xl (which is 3rem, 48px in Tailwind, converted to rem)
        fontWeight: '700', // font-bold
        marginBottom: '1.5rem', // mb-6 (which is 6 * 0.25rem = 1.5rem)
        textAlign: 'center', // text-center
        color: 'white'
      }}>Create an account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="First Name*"
                value={firstName}
                onChange={handleFirstNameChange}
                required
                style={{
                  width: '100%', // w-full
                  padding: '0.75rem', // p-3 (equivalent to 3 * 0.25rem = 0.75rem)
                  borderRadius: '0.5rem', // rounded-lg
                  backgroundColor: '#2d3748', // bg-gray-700
                  border: '1px solid #4a5568',
                  color: '#ffffff', // border-gray-600
                  outline: 'none', // focus:outline-none
                  transition: 'all 0.3s', // Smooth transition for focus effect
                }}
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
                style={{
                  width: '100%', // w-full
                  padding: '0.75rem', // p-3 (equivalent to 3 * 0.25rem = 0.75rem)
                  borderRadius: '0.5rem', // rounded-lg
                  backgroundColor: '#2d3748', // bg-gray-700
                  border: '1px solid #4a5568',
                  color: '#ffffff', // border-gray-600
                  outline: 'none', // focus:outline-none
                  transition: 'all 0.3s', // Smooth transition for focus effect
                }}
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
                style={{
                  width: '100%', // w-full
                  padding: '0.75rem', // p-3 (equivalent to 3 * 0.25rem = 0.75rem)
                  borderRadius: '0.5rem', // rounded-lg
                  backgroundColor: '#2d3748', // bg-gray-700
                  border: '1px solid #4a5568',
                  color: '#ffffff', // border-gray-600
                  outline: 'none', // focus:outline-none
                  transition: 'all 0.3s', // Smooth transition for focus effect
                }}
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
                style={{
                  width: '100%', // w-full
                  padding: '0.75rem', // p-3 (equivalent to 3 * 0.25rem = 0.75rem)
                  borderRadius: '0.5rem', // rounded-lg
                  backgroundColor: '#2d3748', // bg-gray-700
                  border: '1px solid #4a5568',
                  color: '#ffffff', // border-gray-600
                  outline: 'none', // focus:outline-none
                  transition: 'all 0.3s', // Smooth transition for focus effect
                }}
              />
            </div>
            <div className="mb-4">
              <div className="password-input-group input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  placeholder="Password*"
                  onFocus={() => setShowCriteria(true)}
                  onBlur={() => setShowCriteria(false)}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', // w-full
                    padding: '0.75rem', // p-3 (equivalent to 3 * 0.25rem = 0.75rem)
                    borderRadius: '0.5rem', // rounded-lg
                    backgroundColor: '#2d3748', // bg-gray-700
                    border: '1px solid #4a5568',
                    color: '#ffffff', // border-gray-600
                    outline: 'none', // focus:outline-none
                    transition: 'all 0.3s', // Smooth transition for focus effect
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-visibility-toggle"
                  onClick={togglePasswordVisibility}
                >
                  <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
              </div>
              {showCriteria && <PasswordCriteria password={password} />}
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
                  style={{
                    width: '100%', // w-full
                    padding: '0.75rem', // p-3 (equivalent to 3 * 0.25rem = 0.75rem)
                    borderRadius: '0.5rem', // rounded-lg
                    backgroundColor: '#2d3748', // bg-gray-700
                    border: '1px solid #4a5568', 
                    color: '#ffffff',// border-gray-600
                    outline: 'none', // focus:outline-none
                    transition: 'all 0.3s', // Smooth transition for focus effect
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-visibility-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </button>
              </div>
              {confirmPassword && (
                <p className={isPasswordMatch() ? 'text-success' : 'text-danger'}>
                  {isPasswordMatch() ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            {error && <p className="text-danger">{error}</p>}

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-lg">
                Register
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm">Already have an account? <a onClick={handleLoginClick} style={{ cursor: 'pointer' }} className="text-blue-500 hover:underline">Sign in</a></p>

    
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
    </>
  );
};

export default RegisterForm;
