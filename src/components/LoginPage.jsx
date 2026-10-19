import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';

const LoginPage = ({ onLogin, students }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a brief loading state
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find student by ID
    const student = students.find(s => s.id === studentId.trim());
    
    if (!student) {
      setError('Student ID not found. Please check your ID and try again.');
      setIsLoading(false);
      return;
    }

    // Demo-only credentials; production requires server-side authentication.
    if (password !== student.password) {
      setError('Incorrect password. Please try again.');
      setIsLoading(false);
      return;
    }

    // Check if student is active
    if (!student.isActive) {
      setError('Your account is currently inactive. Please contact the administrator.');
      setIsLoading(false);
      return;
    }

    // Login successful
    setIsLoading(false);
    onLogin(student);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative">
      {/* Dark Mode Toggle - Top Right */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-gray-700/20 rounded-md transition-colors"
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span className="text-sm">{isDarkMode ? 'Light' : 'Dark'}</span>
      </button>
      
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center">
          <div className="flex flex-col items-center justify-center">
            <Logo className="w-[300px] h-[300px]" />
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">Enter your credentials to access your study plan</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Student ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Student ID
              </label>
              <input
                type="text"
                id="student-id"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your student ID"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                aria-label="Student ID"
                aria-describedby="student-id-description"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Lock className="h-4 w-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  aria-label="Password"
                  aria-describedby="password-description"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || !studentId.trim() || !password.trim()}
              className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;