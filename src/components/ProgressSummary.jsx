import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { getGradePoints } from '../utils/grading';

const ProgressSummary = ({ studentData, studyPlan }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateProgress = () => {
    const allCourses = [
      ...(studyPlan.preCoreCourses || []),
      ...(studyPlan.coreCourses || []),
      ...(studyPlan.electives || [])
    ];

    let completed = 0;
    let inProgress = 0;
    let planned = 0;
    let totalCredits = 0;
    let completedCredits = 0;
    let gpaPoints = 0;
    let gpaCredits = 0;

    allCourses.forEach(course => {
      const status = studentData.courseStatus[course.code] || '';
      const grade = studentData.grades[course.code] || '';
      
      totalCredits += course.credits;
      
      switch (status) {
        case 'A':
          completed++;
          completedCredits += course.credits;
          if (grade) {
            const gradePoints = getGradePoints(grade);
            gpaPoints += gradePoints * course.credits;
            gpaCredits += course.credits;
          }
          break;
        case 'IP':
          inProgress++;
          break;
        case 'P':
          planned++;
          break;
      }
    });

    // Use the actual CGPA from student data instead of calculating from grades
    const gpa = studentData.cgpa ? studentData.cgpa.toFixed(3) : '0.000';
    const progressPercentage = ((completedCredits / studyPlan.totalCredits) * 100).toFixed(1);

    return {
      completed,
      inProgress,
      planned,
      totalCourses: allCourses.length,
      completedCredits,
      totalCredits: studyPlan.totalCredits,
      gpa,
      progressPercentage
    };
  };

  // Using centralized grading system from utils/grading.js

  const progress = calculateProgress();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      {/* Header with toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 pt-5 pb-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Progress</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {progress.progressPercentage}% complete
          </span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </button>

      {/* Collapsible content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{progress.completed}</p>
          <p className="text-xs text-green-700 dark:text-green-300">{progress.completedCredits} credits</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">{progress.inProgress}</p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">courses</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Planned</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{progress.planned}</p>
          <p className="text-xs text-blue-700 dark:text-blue-300">courses</p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">GPA</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">{progress.gpa}</p>
          <p className="text-xs text-purple-700 dark:text-purple-300">out of 4.0</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{progress.progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress.progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {progress.completedCredits} of {progress.totalCredits} credits completed
        </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;

