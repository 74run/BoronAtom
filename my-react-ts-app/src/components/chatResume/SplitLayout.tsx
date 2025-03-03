import React from 'react';

interface SplitLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

const SplitLayout: React.FC<SplitLayoutProps> = ({ leftContent, rightContent }) => {
  return (
    <div className="flex h-screen bg-gray-900">
      <div className="w-1/2 border-r border-gray-700 overflow-y-auto">
        {leftContent}
      </div>
      <div className="w-1/2 overflow-y-auto bg-gray-800">
        {rightContent}
      </div>
    </div>
  );
};

export default SplitLayout;
