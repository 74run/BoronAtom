// src/components/profile/MainContent.tsx
import React from 'react';
import { UserDetails } from './types'; // Import the UserDetails type

interface MainContentProps {
  activeSection: string;
  userDetails: UserDetails | null;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection, userDetails }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'Profile':
        return <div>Profile Content for {userDetails?.firstName}</div>;
      case 'Summary':
        return <div>Summary Content</div>;
      case 'Projects':
        return <div>Projects Content</div>;
      case 'Experience':
        return <div>Experience Content</div>;
      case 'Education':
        return <div>Education Content</div>;
      case 'Certifications':
        return <div>Certifications Content</div>;
      case 'Involvements':
        return <div>Involvements Content</div>;
      case 'Skills':
        return <div>Skills Content</div>;
      case 'PDFHTML':
        return <div>Resume PDF Content</div>;
      default:
        return <div>Select a section to view content</div>;
    }
  };

  return (
    <div className="col-span-3 bg-gray-700 rounded-lg p-6 shadow-xl">
      {renderContent()}
    </div>
  );
};

export default MainContent;