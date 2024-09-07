import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface CustomUniversityDropdownProps {
  universities?: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const CustomUniversityDropdown: React.FC<CustomUniversityDropdownProps> = ({ 
  universities = [],
  value = '',
  onChange = () => {},
  placeholder = "University Name"
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(value);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredUniversities = universities
    .filter(uni => uni.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleUniversitySelect = (uni: string) => {
    setSearchTerm(uni);
    onChange(uni);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full p-3 pr-10 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          style={{
            borderRadius: "8px",
            border: "1px solid #444",
            padding: "12px",
            fontSize: "1rem",
            marginBottom: "1rem",
            width: "100%",
            backgroundColor: "#1c1c1e",
            color: "#f5f5f5",
          }}
        />
      </div>
      {isOpen && filteredUniversities.length > 0 && (
        <ol className="absolute z-10 w-full mt-1 bg-gray-800 border border-blue-300 rounded-lg shadow-lg max-h-60 overflow-auto list-none">
          {filteredUniversities.map((uni, index) => (
            <li
              key={index}
              onClick={() => handleUniversitySelect(uni)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`px-6 py-3 cursor-pointer transition-all duration-300 ease-in-out transform ${
                hoveredIndex === index
                  ? 'bg-blue-300 text-white shadow-lg scale-105' // Light blue hover effect
                  : 'text-gray-300 bg-gray-800 hover:bg-blue-300 hover:text-white'
              } rounded-lg mb-2`}
            >
              {uni}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default CustomUniversityDropdown;
