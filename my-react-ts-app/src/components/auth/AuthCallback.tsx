import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../services/auth.service';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const uid = params.get('uid');

    if (token && uid) {
      localStorage.setItem('Token', token);
      localStorage.setItem('uid', uid);

      const redirectUrl = localStorage.getItem('redirectUrl') || `/profile/${uid}`;
      localStorage.removeItem('redirectUrl');

      navigate(redirectUrl);
    } else {
      navigate('/login?error=Authentication failed');
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 