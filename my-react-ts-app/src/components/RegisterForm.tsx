// frontend/src/components/RegisterForm.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../css/RegisterForm.css'; // Import your custom CSS file

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility
  const [logdata, setLogData] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user`);
      setLogData(response.data);
    } catch (error) {
      console.error('Error fetching data:', 'Unknown');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/register', { username, password });
      console.log('User registered successfully.');
      console.log('User Data:', logdata);

      // Fetch login details after registration
      const loginDetails = await axios.post('http://localhost:3001/api/login', { username, password });

      navigate(`/`);
      // Now you have loginDetails.data.userId or loginDetails.data._id that you can use in the dashboard
    } catch (error) {
      console.error('Registration error:', 'Unknown error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior

    // Call your login function when the form is submitted
    handleRegister();
  };

  // Function to handle navigation to the login page
  const handleLoginClick = () => {
    navigate('/');
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <div className="password-input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={`btn ${showPassword ? 'btn-primary' : 'btn-light'}`}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-success">
          Register
        </button>
      </form>

      {/* Login button with Bootstrap styling */}
      <div className="login-link">
        <p>Already have an account? </p>
        <button type="button" className="btn btn-outline-primary" onClick={handleLoginClick}>
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
