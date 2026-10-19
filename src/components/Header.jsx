import React from 'react';
import { User } from 'lucide-react';
import Logo from './Logo';

const Header = ({ studentName = "Student" }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Logo className="h-20 w-20" />
              <h1 className="text-xl font-bold text-gray-900">CourseMate</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Hello {studentName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

