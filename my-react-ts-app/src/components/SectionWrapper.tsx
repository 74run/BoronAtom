// src/components/SectionWrapper.tsx
import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children }) => {
  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      {children}
    </div>
  );
};

export default SectionWrapper;
