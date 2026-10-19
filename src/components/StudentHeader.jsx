import React from 'react';
import { User, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';

const StudentHeader = ({ student, onLogout }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Logo className="h-12 w-12 sm:h-20 sm:w-20" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">CourseMate</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">ID: {student.id} | CGPA: {student.cgpa ? student.cgpa.toFixed(3) : '0.000'}</p>
              </div>
            </div>
            
            {/* Mobile user info */}
            <div className="sm:hidden flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
              <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              <div className="text-right">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[80px]">{student.name}</p>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors touch-manipulation min-h-[44px] sm:min-h-0"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="text-sm hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
            
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors touch-manipulation min-h-[44px] sm:min-h-0"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
