import React from 'react';
import SplitLayout from './SplitLayout';
import Chat from './Chat'; // Assuming you have a Chat component
import ResumePreview from './ResumePreview'; // We'll create this next
import { ThemeProvider } from '../ThemeProvider';
import Navbar from '../NavigationBar';

const ResumeBuilder: React.FC = () => {
  // State to store resume data
  const [resumeData, setResumeData] = React.useState({
    // Initialize with empty resume data structure
    personalInfo: {},
    experience: [],
    education: [],
    skills: []
  });

  // Handler for updating resume data based on chat
  const handleChatUpdate = (newData: any) => {
    setResumeData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <ThemeProvider>
      <div className="h-screen bg-gray-900">
        <Navbar UserDetail={null} />
    <div className='flex flex-col h-screen pt-16'>
    <SplitLayout
      leftContent={
        <Chat onUpdate={handleChatUpdate} />
      }
      rightContent={
        <ResumePreview data={resumeData} />
      }
    />
    </div>
</div>
</ThemeProvider>
  );
};

export default ResumeBuilder;
