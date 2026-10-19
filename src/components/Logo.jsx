import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Logo = ({ className = "h-8 w-8" }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <img 
      src={isDarkMode ? "/2.png" : "/1.png"} 
      alt="CourseMate Logo" 
      className={className}
      onError={(e) => {
        // Fallback to a simple text logo if image fails to load
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'block';
      }}
    />
  );
};

export default Logo;
