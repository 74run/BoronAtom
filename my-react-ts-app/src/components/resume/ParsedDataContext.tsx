import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the ParsedData interface
interface ParsedData {
  name?: string;
  contact?: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  summary?: string;
  skills?: string[];
  education?: string[];
  experience?: string[];
  projects?: string[];
  certifications?: string[];
  involvements?: string[];
}

interface ParsedDataContextProps {
  parsedData: ParsedData | null;
  setParsedData: (data: ParsedData) => void;
}

// Create the context with default values
const ParsedDataContext = createContext<ParsedDataContextProps>({
  parsedData: null,
  setParsedData: () => {},
});

export const ParsedDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  return (
    <ParsedDataContext.Provider value={{ parsedData, setParsedData }}>
      {children}
    </ParsedDataContext.Provider>
  );
};

// Custom hook to use the ParsedDataContext
export const useParsedData = () => useContext(ParsedDataContext);
