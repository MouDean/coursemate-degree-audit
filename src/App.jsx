import React, { useState, useEffect, Suspense, lazy } from 'react';
import LoginPage from './components/LoginPage';
import StudentHeader from './components/StudentHeader';
import ProgressSummary from './components/ProgressSummary';
import CourseSection from './components/CourseSection';
import RecommendationPanel from './components/RecommendationPanel';
import InteractiveRoadmap from './components/InteractiveRoadmap';
import AdminExcelImporter from './components/AdminExcelImporter';
import CourseRegistrationRequest from './components/CourseRegistrationRequest';

// Lazy load the AdvisorApp component for better performance
const AdvisorApp = lazy(() => import('./components/AdvisorApp'));
import { studyPlans } from './data/studentDatabase';
import studentDataService from './services/studentDataService';
import { ThemeProvider } from './contexts/ThemeContext';
import { downloadStudentPDF } from './utils/pdfExport';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [customCourses, setCustomCourses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('courses'); // 'overview', 'courses', or 'registration'
  const [selectedElectives, setSelectedElectives] = useState({
    ELECTIVE_1: null,
    ELECTIVE_2: null
  });
  const [appMode, setAppMode] = useState('student'); // 'student' or 'advisor'

  // Load data on component mount
  useEffect(() => {
    const students = studentDataService.getAllStudents();
    const currentStudent = studentDataService.getCurrentStudent();
    
    setAllStudents(students);
    
    if (currentStudent) {
      setCurrentStudent(currentStudent);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (student) => {
    setCurrentStudent(student);
    setIsLoggedIn(true);
    setIsAdmin(student.id === 'admin' || student.name.toLowerCase().includes('admin'));
    studentDataService.setCurrentStudent(student);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentStudent(null);
    setIsAdmin(false);
    studentDataService.logout();
  };

  const handleStatusChange = (courseCode, status) => {
    if (currentStudent) {
      const updatedStudent = studentDataService.updateStudentCourseStatus(
        currentStudent.id, 
        courseCode, 
        status
      );
      if (updatedStudent) {
        setCurrentStudent(updatedStudent);
      }
    }
  };

  const handleGradeChange = (courseCode, grade) => {
    if (currentStudent) {
      const updatedStudent = studentDataService.updateStudentGrade(
        currentStudent.id, 
        courseCode, 
        grade
      );
      if (updatedStudent) {
        setCurrentStudent(updatedStudent);
      }
    }
  };

  const handleStudentInfoChange = (field, value) => {
    if (currentStudent) {
      const updatedStudent = studentDataService.updateStudent(currentStudent.id, {
        [field]: value
      });
      if (updatedStudent) {
        setCurrentStudent(updatedStudent);
      }
    }
  };

  const handleElectiveChange = (electiveSlot, course) => {
    setSelectedElectives(prev => ({
      ...prev,
      [electiveSlot]: course
    }));
  };

  const handleStudentsImport = (students, courses) => {
    try {
      studentDataService.importStudentsFromExcel({ students, courses });
      const updatedStudents = studentDataService.getAllStudents();
      setAllStudents(updatedStudents);
      setCustomCourses(courses);
    } catch (error) {
      console.error('Error importing students:', error);
    }
  };

  // Show advisor app if in advisor mode
  if (appMode === 'advisor') {
    return (
      <ThemeProvider>
        <Suspense fallback={
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading Advisor Portal...</p>
            </div>
          </div>
        }>
          <AdvisorApp 
            onSwitchToStudent={() => setAppMode('student')} 
            appMode={appMode}
            setAppMode={setAppMode}
          />
        </Suspense>
      </ThemeProvider>
    );
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          {/* Mode Selection */}
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
          <LoginPage onLogin={handleLogin} students={allStudents} />
        </div>
      </ThemeProvider>
    );
  }

  // Debug: Check if currentStudent has required data
  if (!currentStudent) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Student Data...</h2>
            <p className="text-gray-600 dark:text-gray-300">Please wait while we load your information.</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Debug: Check if studyPlan exists
  if (!currentStudent.studyPlan) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Study Plan Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300">Student {currentStudent.name} (ID: {currentStudent.id}) does not have a study plan assigned.</p>
            <button 
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Back to Login
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Mode Selection - Always Visible */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-center py-1 sm:py-0.5">
              <div className="flex space-x-0.5 bg-gray-100 dark:bg-gray-700 p-0.5 rounded-sm">
                <button
                  onClick={() => setAppMode('student')}
                  className={`px-2 sm:px-2 py-1 sm:py-0.5 text-xs font-medium rounded-sm transition-colors touch-manipulation min-h-[44px] sm:min-h-0 ${
                    appMode === 'student'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  aria-label="Switch to Student Portal"
                >
                  <span className="hidden sm:inline">Student Portal</span>
                  <span className="sm:hidden">Student</span>
                </button>
                <button
                  onClick={() => setAppMode('advisor')}
                  className={`px-2 sm:px-2 py-1 sm:py-0.5 text-xs font-medium rounded-sm transition-colors touch-manipulation min-h-[44px] sm:min-h-0 ${
                    appMode === 'advisor'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  aria-label="Switch to Advisor Portal"
                >
                  <span className="hidden sm:inline">Advisor Portal</span>
                  <span className="sm:hidden">Advisor</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <StudentHeader student={currentStudent} onLogout={handleLogout} />
        
        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Admin Info */}
        {isAdmin && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Admin Panel</h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              System is pre-populated with {allStudents.length} students from your Excel data. 
              Students can log in using their Student ID as password.
            </p>
          </div>
        )}

        {/* Student Info Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Name</label>
              <input
                type="text"
                value={currentStudent.name}
                onChange={(e) => handleStudentInfoChange('name', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter student name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student ID</label>
              <input
                type="text"
                value={currentStudent.id}
                onChange={(e) => handleStudentInfoChange('id', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter student ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program</label>
              <input
                type="text"
                value={currentStudent.program || "Master of Education in Educational Leadership"}
                readOnly
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Data Management */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Management</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  // Save current student data
                  studentDataService.setCurrentStudent(currentStudent);
                  alert('Your progress has been saved successfully!');
                }}
                className="px-3 py-1.5 bg-green-600 dark:bg-green-700 text-white rounded text-xs font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
              >
                💾 Save
              </button>
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(currentStudent, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${currentStudent.name}_study_plan.json`;
                  link.click();
                }}
                className="px-3 py-1.5 bg-blue-600 dark:bg-blue-700 text-white rounded text-xs font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                📥 Export JSON
              </button>
              <button
                onClick={async () => {
                  try {
                    await downloadStudentPDF(currentStudent, studyPlans[currentStudent.studyPlan]);
                  } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Error generating PDF. Please try again.');
                  }
                }}
                className="px-3 py-1.5 bg-purple-600 dark:bg-purple-700 text-white rounded text-xs font-medium hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
              >
                📄 Export PDF
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all student data? This cannot be undone.')) {
                      studentDataService.clearAllData();
                      setAllStudents([]);
                      setCurrentStudent(null);
                      setIsLoggedIn(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-red-600 dark:bg-red-700 text-white rounded text-xs font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                >
                  🗑️ Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'courses'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Course Cards</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Overview & Roadmap</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('registration')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'registration'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Registration Requests</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Progress Summary */}
            <ProgressSummary studentData={currentStudent} studyPlan={studyPlans[currentStudent.studyPlan]} />

            {/* Interactive Roadmap */}
            <div className="mb-6">
              <InteractiveRoadmap 
                studentData={currentStudent} 
                studyPlan={studyPlans[currentStudent.studyPlan]} 
                onCourseStatusChange={handleStatusChange}
                selectedElectives={selectedElectives}
                onElectiveChange={handleElectiveChange}
              />
            </div>

            {/* Recommendations */}
            <div className="mb-6">
              <RecommendationPanel studentData={currentStudent} studyPlan={studyPlans[currentStudent.studyPlan]} />
            </div>
          </>
        )}

        {/* Course Cards Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Course Sections - Dynamic based on study plan */}
            {currentStudent.studyPlan && studyPlans[currentStudent.studyPlan] ? (
              <>
                {/* Core Courses */}
                <CourseSection
                  title={`Core Courses (24 Credits) - ${studyPlans[currentStudent.studyPlan].name}`}
                  courses={studyPlans[currentStudent.studyPlan].coreCourses}
                  studentData={currentStudent}
                  onStatusChange={handleStatusChange}
                  onGradeChange={handleGradeChange}
                  bgColor="bg-blue-50"
                />

                {/* Elective Courses (Core Electives) */}
                {studyPlans[currentStudent.studyPlan].electives.length > 0 && (
                  <CourseSection
                    title="Core Electives (6 Credits)"
                    courses={studyPlans[currentStudent.studyPlan].electives}
                    studentData={currentStudent}
                    onStatusChange={handleStatusChange}
                    onGradeChange={handleGradeChange}
                    bgColor="bg-green-50"
                  />
                )}
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Study Plan Not Found</h3>
                <p className="text-yellow-800 text-sm">
                  No study plan found for {currentStudent.studyPlan}. Please contact the administrator.
                </p>
              </div>
            )}

            {/* Custom Courses from Excel */}
            {customCourses.length > 0 && (
              <CourseSection
                title="Additional Courses (Imported from Excel)"
                courses={customCourses}
                studentData={currentStudent}
                onStatusChange={handleStatusChange}
                onGradeChange={handleGradeChange}
                bgColor="bg-orange-50"
              />
            )}
          </div>
        )}

        {/* Registration Requests Tab */}
        {activeTab === 'registration' && (
          <CourseRegistrationRequest 
            studentData={currentStudent} 
            studyPlan={studyPlans[currentStudent.studyPlan]} 
          />
        )}


        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
