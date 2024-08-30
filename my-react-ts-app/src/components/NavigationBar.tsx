import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../css/Navbar.css'; // Import custom CSS for Navbar styling
import { Navbar as BootstrapNavbar, Nav as BootstrapNav, NavDropdown, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import axios from 'axios';
import logo from './logo-no-background.png'; 

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface NavbarProps {
  UserDetail: UserDetails | null;
  // Add any props you need
}

const Navbar: React.FC<NavbarProps> = () => {
  const [profileImage, setProfileImage] = useState<string>('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const userID = localStorage.getItem('UserID');

    if (userID) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/image`, { responseType: 'arraybuffer' })
        .then(response => {
          const base64Image = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );
          const contentType = response.headers['content-type'];
          setProfileImage(`data:${contentType};base64,${base64Image}`);
        })
        .catch(error => {
          console.error('Error fetching profile image:', error);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('UserID');
    navigate('/login');
  };

  const userID = localStorage.getItem('UserID'); // Retrieve userID to use in links

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="md" fixed="top" className="custom-navbar shadow-sm">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <Image 
            src={logo} 
            alt="Brand Logo" 
            className="d-inline-block align-top img-fluid" 
            style={{ height: 'auto', maxHeight: '30px', marginRight: '15px' }} 
          />
        </Link>

        <BootstrapNavbar.Toggle aria-controls="navbarResponsive">
          <FontAwesomeIcon icon={faBars} />
        </BootstrapNavbar.Toggle>

        <BootstrapNavbar.Collapse id="navbarResponsive">
          <div className="d-flex flex-column flex-md-row align-items-center w-100">
            <BootstrapNav className="ms-md-auto d-flex align-items-center">
              <Link
                to="/ai-resume"
                className={`nav-link ${location.pathname === '/ai-resume' ? 'active' : ''} custom-nav-link mx-2 px-4 py-2`}
              >
                AI Resume
              </Link>
              <Link
                to={`/ai-cover-letter/${userID}`}
                className={`nav-link ${location.pathname === `/ai-cover-letter/${userID}` ? 'active' : ''} custom-nav-link mx-2 px-4 py-2`}
              >
                AI Cover Letter
              </Link>

              <div className="mx-3 d-flex align-items-center">
                <NavDropdown title={<Image src={profileImage || `https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`} alt="Profile" roundedCircle className="profile-pic shadow-sm" />} align="end" className="custom-dropdown">
                  <NavDropdown.Item>
                    <Image src={profileImage || `https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`} alt="Profile" roundedCircle className="profile-pic me-2" />
                    Your Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>Settings</NavDropdown.Item>
                  <NavDropdown.Item>Privacy</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </div>
            </BootstrapNav>
          </div>
        </BootstrapNavbar.Collapse>
      </div>
    </BootstrapNavbar>
  );
};

export default Navbar;
