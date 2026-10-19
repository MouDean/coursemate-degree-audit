// Grading System - Abu Dhabi University MEDEL Program
// Based on the official grading schema

export const GRADING_SCHEMA = {
  'A': { points: 4.0, percentage: '100-90%', description: 'Excellent' },
  'B+': { points: 3.5, percentage: '89-85%', description: 'Very Good' },
  'B': { points: 3.0, percentage: '84-80%', description: 'Good' },
  'C+': { points: 2.5, percentage: '79-75%', description: 'Satisfactory' },
  'C': { points: 2.0, percentage: '74-70%', description: 'Pass' },
  'F': { points: 0.0, percentage: 'Less than 70%', description: 'Fail' },
  'I': { points: 0.0, percentage: 'N/A', description: 'Incomplete' }
};

// Get grade points for a given grade
export const getGradePoints = (grade) => {
  return GRADING_SCHEMA[grade]?.points || 0;
};

// Get grade information
export const getGradeInfo = (grade) => {
  return GRADING_SCHEMA[grade] || { points: 0, percentage: 'N/A', description: 'Unknown' };
};

// Calculate GPA from an array of grades
export const calculateGPA = (grades) => {
  if (!grades || grades.length === 0) return 0;
  
  const totalPoints = grades.reduce((sum, grade) => sum + getGradePoints(grade), 0);
  return totalPoints / grades.length;
};

// Get all available grades
export const getAllGrades = () => {
  return Object.keys(GRADING_SCHEMA);
};

// Check if a grade is passing
export const isPassingGrade = (grade) => {
  return getGradePoints(grade) >= 2.0;
};

// Get grade color for UI display
export const getGradeColor = (grade) => {
  const colors = {
    'A': 'text-green-600 bg-green-50',
    'B+': 'text-blue-600 bg-blue-50',
    'B': 'text-blue-500 bg-blue-50',
    'C+': 'text-yellow-600 bg-yellow-50',
    'C': 'text-yellow-500 bg-yellow-50',
    'F': 'text-red-600 bg-red-50',
    'I': 'text-gray-600 bg-gray-50'
  };
  return colors[grade] || 'text-gray-600 bg-gray-50';
};
