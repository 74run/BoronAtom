import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, User, Bot, Download, Edit, Shield } from 'lucide-react';
import { Navbar } from './ui/navbar';


const LandingPage: React.FC = () => {
  // Add smooth scroll behavior for anchor links
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    // Add click handler to all anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
        if (href) {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    
    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', (e: Event) => {
          e.preventDefault();
          const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
          if (href) {
            const element = document.querySelector(href);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });
    };
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-56">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="https://videos.pexels.com/video-files/2792370/2792370-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="relative text-center animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Build Your Professional Resume
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create stunning resumes with AI assistance and professional templates. Stand out in your job search with ease.
          </p>
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 inline-block transform hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Edit className="w-12 h-12 text-blue-400" />,
              title: "Easy to Use Editor",
              description: "Intuitive interface to create and edit your resume sections with real-time preview.",
            },
            {
              icon: <Bot className="w-12 h-12 text-blue-400" />,
              title: "AI Assistant",
              description: "Get intelligent suggestions and improvements for your resume content.",
            },
            {
              icon: <Download className="w-12 h-12 text-blue-400" />,
              title: "Export Options",
              description: "Download your resume in multiple formats including PDF and Word.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-8 rounded-xl hover:bg-gray-700 transition duration-300 transform hover:scale-105"
            >
              <div className="mb-6 flex justify-center">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-center">{feature.title}</h3>
              <p className="text-gray-400 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-900 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", text: "Sign up for free" },
              { step: "2", text: "Choose a template" },
              { step: "3", text: "Add your details" },
              { step: "4", text: "Download your resume" },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition duration-300"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">{item.step}</span>
                </div>
                <p className="text-xl text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center transform hover:scale-102 transition duration-300">
          <h2 className="text-4xl font-bold mb-8">Ready to Build Your Resume?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already created their perfect resume and landed their dream jobs.
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 inline-block transform hover:scale-105"
          >
            Create Your Resume Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="text-lg">© 2024 Resume Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 