import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../css/RegisterForm.css'; // Import your custom CSS file
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logdata, setLogData] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const saveDataToLocalStorage = (data: { data: { userId: any; }; }) => {
    const userId = data.data.userId;

    // Set data in localStorage with a timestamp
    const timestamp = new Date().getTime();
    localStorage.setItem('userId', JSON.stringify({ userId, timestamp }));
  };

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
      const response = await axios.post('http://localhost:3001/api/register', {
        firstName,
        lastName,
        email,
        username,
        password,
        confirmPassword,
      });

      console.log('User registered successfully.');
      console.log('User Data:', response.data);
      const { data } = response;
      // In your React component
      saveDataToLocalStorage(data);

      // localStorage.setItem('userId', userId);

      // Navigate to the home page after successful registration
      navigate('/verifyotp');
      // You might want to display a message to the user indicating successful registration
    } catch (error: any) {
      // Explicitly specify the type of 'error' as 'any'
      console.error('Registration error:', error.message || 'Unknown error');
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

  // Function to toggle confirmPassword visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name:</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name:</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="text"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
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
        <div className="mb-3">
          <label className="form-label">Confirm Password:</label>
          <div className="password-input-group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn eye-icon-btn"
              onClick={toggleConfirmPasswordVisibility}
            >
              <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
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
