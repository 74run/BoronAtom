import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { Menu, X } from "lucide-react";
import logo from "../images/logo-no-background.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Templates", href: "/templates" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      // Handle hash navigation for same page
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Handle route navigation
      navigate(href);
    }
    setIsOpen(false); // Close mobile menu after navigation
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <img 
              src={logo}
              alt="Boron Atom Logo" 
              className="h-6 sm:h-7 w-auto"
            />
       
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 rounded-lg mt-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.href)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 px-3 pt-4 pb-2">
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="ghost" className="w-full text-gray-300 hover:text-white">
                    Log in
                  </Button>
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
