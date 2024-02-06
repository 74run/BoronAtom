// Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; 2024 Boron Atom</p>
    </footer>
  );
};

const footerStyle: React.CSSProperties = {
  backgroundColor: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '1rem',
  position: 'relative',
  bottom: 0,
  width: '100%',
};

export default Footer;
