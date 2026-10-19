import React, { useState } from 'react';
import AdvisorLogin from './AdvisorLogin';
import AdvisorDashboard from './AdvisorDashboard';

const AdvisorApp = ({ onSwitchToStudent, appMode, setAppMode }) => {
  const [advisorData, setAdvisorData] = useState(null);

  const handleLogin = (advisor) => {
    setAdvisorData(advisor);
  };

  const handleLogout = () => {
    setAdvisorData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mode Selection - Always Visible */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-0.5">
            <div className="flex space-x-0.5 bg-gray-100 dark:bg-gray-700 p-0.5 rounded-sm">
              <button
                onClick={() => setAppMode('student')}
                className={`px-2 py-0.5 text-xs font-medium rounded-sm transition-colors ${
                  appMode === 'student'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Student Portal
              </button>
              <button
                onClick={() => setAppMode('advisor')}
                className={`px-2 py-0.5 text-xs font-medium rounded-sm transition-colors ${
                  appMode === 'advisor'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Advisor Portal
              </button>
            </div>
          </div>
        </div>
      </div>

      {!advisorData ? (
        <AdvisorLogin onLogin={handleLogin} onSwitchToStudent={onSwitchToStudent} />
      ) : (
        <AdvisorDashboard advisorData={advisorData} onLogout={handleLogout} onSwitchToStudent={onSwitchToStudent} />
      )}
    </div>
  );
};

export default AdvisorApp;
