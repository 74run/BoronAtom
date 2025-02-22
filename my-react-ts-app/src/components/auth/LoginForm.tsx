import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../ui/navbar';
import { Button } from '../ui/button';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useParams } from 'wouter';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [userID, setUserID] = useState('');
  
  const navigate = useNavigate();
  const { isLoggedIn, userData, isLoading: userContextLoading } = useContext(UserContext);

  useEffect(() => {
    if (!userContextLoading && isLoggedIn && userData?.userID) {
      navigate(`/profile/${userData.userID}`);
    }
  }, [userContextLoading, isLoggedIn, userData, navigate]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Update handleGoogleSignIn to use navigate instead of window.location
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email;

      if (!email) {
        throw new Error('No email provided from Google');
      }

      // Call your backend to verify/create user
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/google/verify`, {
        email: email
      });

      const { success, userID } = response.data;

      if (success) {
        onLogin();
        navigate(`/profile/${userID}`);
      } else {
        setError('Failed to authenticate with Google');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const idToken = await userCredential.user.getIdToken();
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { 
        idToken 
      });
      
      const { success, message, userID } = response.data;

      if (success) {
        onLogin();
        navigate(`/profile/${userID}`);
      } else {
        setError(message || 'Login failed');
      }
    } catch (error: any) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  //   } catch (error) {
  //     setError('Google login failed. Please try again.');
  //   }
  // };

  const handleLinkedInLogin = async () => {
    try {
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/linkedin`;
    } catch (error) {
      setError('LinkedIn login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-700">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to continue to Boron Atom</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-8">
              <button
                 onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 group"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="text-gray-300 group-hover:text-white">Continue with Google</span>
              </button>
              
              <button
                onClick={handleLinkedInLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 group"
              >
                <FaLinkedin className="w-5 h-5 text-[#0A66C2]" />
                <span className="text-gray-300 group-hover:text-white">Continue with LinkedIn</span>
              </button>
            </div>

            {/* <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800/50 text-gray-400">Or continue with email</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email or username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Remember me</span>
                </label>
                <Link
                  to="/forgotpassword"
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center border border-blue-500 shadow-lg ${
                  isLoading ? 'opacity-70' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
              >
                Sign up for free
              </Link>
            </p>
            */}
          </div>
        </div> 
      </div>
    </div>
  );
};

export default LoginForm;