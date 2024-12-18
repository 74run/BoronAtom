import React from 'react';
import {
  User,
  FileText,
  Code,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Lightbulb,
  FileUp,
} from 'lucide-react';
import { UserDetails } from './types';

interface SidebarProps {
  userDetails: UserDetails | null;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navbar: React.FC<SidebarProps> = ({
  userDetails,
  activeSection,
  setActiveSection,
}) => {
  const menuItems = [
    { name: 'Profile', icon: User, section: 'Profile' },
    { name: 'Summary', icon: FileText, section: 'Summary' },
    { name: 'Projects', icon: Code, section: 'Projects' },
    { name: 'Experience', icon: Briefcase, section: 'Experience' },
    { name: 'Education', icon: GraduationCap, section: 'Education' },
    { name: 'Certifications', icon: Award, section: 'Certifications' },
    { name: 'Involvements', icon: Users, section: 'Involvements' },
    { name: 'Skills', icon: Lightbulb, section: 'Skills' },
    { name: 'Resume PDF', icon: FileUp, section: 'PDFHTML' },
  ];

  return (
    <div className="bg-gray-800 shadow-lg w-64 flex-shrink-0 min-h-screen">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userDetails?.firstName?.[0] || ''}{userDetails?.lastName?.[0] || ''}
          </div>
          <h2 className="text-xl font-bold text-white">
            {userDetails?.firstName} {userDetails?.lastName || ''}
          </h2>
          <p className="text-gray-400 text-sm">{userDetails?.email || 'No email available'}</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.section}>
              <button
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center p-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out 
                  ${
                    activeSection === item.section
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
