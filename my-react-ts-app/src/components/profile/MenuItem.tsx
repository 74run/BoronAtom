import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MenuItemProps {
  item: {
    name: string;
    icon: LucideIcon;
    section: string;
    color?: string;
  };
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  item: { name, icon: Icon, section, color }, 
  activeSection, 
  setActiveSection 
}) => {
  const isActive = activeSection === section;
  const defaultColor = isActive ? 'text-white' : 'text-gray-400';
  const activeColor = color || 'text-blue-500';

  return (
    <motion.div 
      className={`
        relative 
        flex items-center 
        px-4 py-3 
        rounded-lg 
        cursor-pointer 
        group 
        transition-all 
        duration-300 
        ${isActive 
          ? `${activeColor} bg-white/10` 
          : 'hover:bg-white/5 hover:text-white'}
      `}
      onClick={() => setActiveSection(section)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setActiveSection(section)}
    >
      <Icon 
        className={`
          w-5 h-5 mr-3 
          transition-all 
          duration-300 
          ${isActive ? activeColor : defaultColor}
          group-hover:scale-110
        `} 
      />
      <span 
        className={`
          text-sm 
          font-medium 
          transition-all 
          duration-300 
          ${isActive ? 'font-bold' : 'font-normal'}
          ${isActive ? activeColor : defaultColor}
        `}
      >
        {name}
      </span>
      {isActive && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute right-0 w-1 h-6 bg-blue-500 rounded-l-full"
        />
      )}
    </motion.div>
  );
};

export default MenuItem;
