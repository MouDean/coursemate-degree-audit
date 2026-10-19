import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGradeColor, getGradeInfo } from '../utils/grading';

const CourseCard = ({ course, status, grade, onStatusChange, onGradeChange }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'A':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'X':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'IP':
        return <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'P':
        return <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'A':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'X':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'IP':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'P':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'A':
        return 'Completed';
      case 'X':
        return 'Failed';
      case 'IP':
        return 'In Progress';
      case 'P':
        return 'Planned';
      default:
        return 'Not Taken';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md dark:hover:shadow-lg ${getStatusColor(status)}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">{course.code}</span>
            {getStatusIcon(status)}
          </div>
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{course.title}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{course.credits} credits</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Status:</span>
          <select
            value={status}
            onChange={(e) => onStatusChange(course.code, e.target.value)}
            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Not Taken</option>
            <option value="A">Completed</option>
            <option value="X">Failed</option>
            <option value="IP">In Progress</option>
            <option value="P">Planned</option>
          </select>
        </div>

        {status === 'A' && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Grade:</span>
            <select
              value={grade || ''}
              onChange={(e) => onGradeChange(course.code, e.target.value)}
              className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select Grade</option>
              <option value="A">A (100-90%)</option>
              <option value="B+">B+ (89-85%)</option>
              <option value="B">B (84-80%)</option>
              <option value="C+">C+ (79-75%)</option>
              <option value="C">C (74-70%)</option>
              <option value="F">F (Less than 70%)</option>
              <option value="I">I (Incomplete)</option>
            </select>
          </div>
        )}
      </div>

      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Prerequisites:</span> {course.prerequisites.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseCard;

