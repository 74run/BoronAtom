import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../ui/navbar';
import { Button } from '../ui/button';
import { Mail } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import '../../css/ForgotPassword.css'; // Import custom CSS

import back from '../images/unnamed-1.png'

import logo from '../images/small-logo.png'; // Your logo file

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLinkSent, setIsResetLinkSent] = useState(false);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/forgotpassword`, { 
        email 
      });
      
      const { success, message } = response.data;

      if (success) {
        setIsResetLinkSent(true);
        localStorage.setItem('Email', email);
      } else {
        setError(message || 'Failed to send reset link');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-700">
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src={logo} 
                  alt="Boron Atom Logo" 
                  className="h-12 w-auto"
                />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
              <p className="text-gray-400">
                {isResetLinkSent 
                  ? "Check your email for the reset link" 
                  : "Enter your email to receive a password reset link"}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {isResetLinkSent ? (
              <div className="text-center space-y-6">
                <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
                  <p className="text-green-400 text-sm">
                    Reset link has been sent to your email address
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Didn't receive the email? Check your spam folder or try again
                  </p>
                  <Button
                    onClick={() => setIsResetLinkSent(false)}
                    variant="outline"
                    size="full"
                  >
                    Try again
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="full"
                  disabled={isLoading}
                  className="font-semibold"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            )}

            <div className="mt-8 text-center space-y-4">
              <p className="text-sm text-gray-400">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                >
                  Back to login
                </Link>
              </p>
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
