import React from 'react';
import CourseCard from './CourseCard';

const CourseSection = ({ title, courses, studentData, onStatusChange, onGradeChange, bgColor = "bg-gray-50" }) => {
  // Convert bgColor to dark mode equivalent
  const getDarkModeBgColor = (color) => {
    switch (color) {
      case "bg-blue-50":
        return "dark:bg-blue-900/20";
      case "bg-green-50":
        return "dark:bg-green-900/20";
      case "bg-orange-50":
        return "dark:bg-orange-900/20";
      case "bg-gray-50":
      default:
        return "dark:bg-gray-800";
    }
  };

  return (
    <div className={`${bgColor} ${getDarkModeBgColor(bgColor)} rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.code}
            course={course}
            status={studentData.courseStatus[course.code] || ''}
            grade={studentData.grades[course.code] || ''}
            onStatusChange={onStatusChange}
            onGradeChange={onGradeChange}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSection;

