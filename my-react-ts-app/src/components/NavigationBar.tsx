import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css'; // Import custom CSS for Navbar styling
import { Navbar as BootstrapNavbar, Nav as BootstrapNav, NavDropdown, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBell, faUserFriends, faBars } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
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
  const [activeItem, setActiveItem] = useState<string>('home');
  const [profileImage, setProfileImage] = useState<string>('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const navigate = useNavigate();

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    // You can add additional logic here if needed
  };

  const handleLogout = () => {
    // Perform the logout actions here
    localStorage.removeItem('Token');
    localStorage.removeItem('UserID');
    navigate('/login');
  };

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

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="md" fixed="top" className="custom-navbar">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <Image 
            src={logo} 
            alt="Boron Atom Logo" 
            className="d-inline-block align-top img-fluid" 
            style={{ marginLeft: '10px', height: 'auto', maxHeight: '25px', width: 'auto' }} 
          />
        </Link>

        <BootstrapNavbar.Toggle aria-controls="navbarResponsive">
          <FontAwesomeIcon icon={faBars} />
        </BootstrapNavbar.Toggle>

        <BootstrapNavbar.Collapse id="navbarResponsive">
          <div className="d-flex flex-column flex-md-row align-items-center w-100">
            <div className="input-group mx-md-auto" style={{ maxWidth: '400px' }}>
              {/* Commented out the search bar for now */}
            </div>

            <BootstrapNav className="ms-md-auto">
              <div className="d-flex flex-column flex-md-row align-items-center">
                <Link
                  to="/"
                  className={`nav-link ${activeItem === 'home' ? 'active' : ''}`}
                  onClick={() => handleItemClick('home')}
                >
                  <FontAwesomeIcon icon={faHome} /> Home
                </Link>
                <Link
                  to="/notifications"
                  className={`nav-link ${activeItem === 'notifications' ? 'active' : ''}`}
                  onClick={() => handleItemClick('notifications')}
                >
                  <FontAwesomeIcon icon={faBell} /> Notifications
                </Link>
                <Link
                  to="/add-friends"
                  className={`nav-link ${activeItem === 'add-friends' ? 'active' : ''}`}
                  onClick={() => handleItemClick('add-friends')}
                >
                  <FontAwesomeIcon icon={faUserFriends} /> Add Friends
                </Link>
              </div>

              <div style={{ display: 'flex', marginLeft: '10px' }}>
                <NavDropdown title={<Image src={profileImage || `https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`} alt="Profile" roundedCircle className="profile-pic" />} align="end">
                  <NavDropdown.Item>
                    <Image src={profileImage || `https://avatar.iran.liara.run/public/boy?username=${userDetails?.username}`} alt="Profile" roundedCircle className="profile-pic" />
                    Your Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>Notifications</NavDropdown.Item>
                  <NavDropdown.Item>Add Friends</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>Settings</NavDropdown.Item>
                  <NavDropdown.Item>Privacy</NavDropdown.Item>
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
