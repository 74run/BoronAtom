import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks: FooterLink[] = [
    { label: 'Templates', href: '/templates' },
    { label: 'Build Resume', href: '/build' },
    { label: 'AI Assistant', href: '/ai-assistant' },
    { label: 'Pricing', href: '/pricing' },
  ];

  const resources: FooterLink[] = [
    { label: 'Blog', href: '/blog' },
    { label: 'Career Tips', href: '/career-tips' },
    { label: 'Resume Examples', href: '/examples' },
    { label: 'Help Center', href: '/help' },
  ];

  const legal: FooterLink[] = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Boron Atom</h2>
            <p className="text-sm">
              Create professional resumes in minutes with the power of AI.
              Stand out from the crowd and land your dream job.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <a href="https://github.com" className="hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {currentYear} Boron Atom. All rights reserved.
            </p>
            <p className="text-sm mt-4 md:mt-0">
              Made with ❤️ for job seekers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;