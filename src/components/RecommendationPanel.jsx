import React, { useState } from 'react';
import { Lightbulb, ArrowRight, AlertCircle, Clock, Target, BookOpen, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecommendationPanel = ({ studentData, studyPlan }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRecommendations = () => {
    const recommendations = [];
    const allCourses = [
      ...(studyPlan.preCoreCourses || []),
      ...(studyPlan.coreCourses || []),
      ...(studyPlan.electives || [])
    ];

    // Calculate progress statistics
    const completedCredits = allCourses
      .filter(course => studentData.courseStatus[course.code] === 'A')
      .reduce((sum, course) => sum + course.credits, 0);
    
    const inProgressCredits = allCourses
      .filter(course => studentData.courseStatus[course.code] === 'IP')
      .reduce((sum, course) => sum + course.credits, 0);
    
    // Calculate total credits the student will have (completed + in-progress)
    const totalCreditsStudentWillHave = completedCredits + inProgressCredits;
    
    // For timeline calculations, exclude in-progress courses since they're already being taken
    const remainingCredits = studyPlan.totalCredits - totalCreditsStudentWillHave;
    const progressPercentage = (totalCreditsStudentWillHave / studyPlan.totalCredits) * 100;
    
    // Check if student will have enough credits to graduate (completed + in-progress)
    const willHaveEnoughCreditsToGraduate = totalCreditsStudentWillHave >= studyPlan.totalCredits;

    // Add graduation progress summary
    recommendations.push({
      type: 'progress_summary',
      title: 'Graduation Progress',
      priority: 'info',
      data: {
        completedCredits,
        inProgressCredits,
        remainingCredits,
        totalCredits: studyPlan.totalCredits,
        progressPercentage
      }
    });

    // Add academic calendar explanation for new students
    if (completedCredits < 6) { // Show this to students who are just starting
      recommendations.push({
        type: 'academic_calendar',
        title: 'Academic Calendar Structure',
        priority: 'info',
        message: 'Academic Year Structure: Fall & Spring (2 terms each: Term A & Term B), Winter & Summer (1 term each). You can take 1 course per term.',
        data: {
          longSemesters: 'Fall & Spring (2 courses each)',
          shortSemesters: 'Winter & Summer (1 course each)',
          totalPerYear: '6 courses per year maximum'
        }
      });
    }

    // Find courses that can be taken next (prerequisites met)
    const availableCourses = allCourses.filter(course => {
      const status = studentData.courseStatus[course.code] || '';
      
      // Skip if already completed or in progress
      if (status === 'A' || status === 'IP') return false;
      
      // Check if prerequisites are met
      if (course.prerequisites && course.prerequisites.length > 0) {
        return course.prerequisites.every(prereq => {
          // Handle special prerequisite cases
          if (prereq.includes('completion of')) {
            // For thesis prerequisite "completion of 18 Core credits"
            const completedCoreCredits = studyPlan.coreCourses
              .filter(c => studentData.courseStatus[c.code] === 'A')
              .reduce((sum, c) => sum + c.credits, 0);
            return completedCoreCredits >= 18;
          }
          return studentData.courseStatus[prereq] === 'A';
        });
      }
      
      return true;
    });

    // Prioritize courses by type and importance
    const availableCoreCourses = availableCourses.filter(course => 
      studyPlan.coreCourses.some(c => c.code === course.code)
    );
    
    const availableElectives = availableCourses.filter(course => 
      studyPlan.electives.some(c => c.code === course.code)
    );

    // Next semester recommendations (2 courses: Term A and Term B)
    // Only suggest if student won't have enough credits to graduate
    if (availableCoreCourses.length > 0 && !willHaveEnoughCreditsToGraduate) {
      const nextSemesterCourses = availableCoreCourses.slice(0, 2); // Recommend 2 courses for Term A & B
      const totalCredits = nextSemesterCourses.reduce((sum, course) => sum + course.credits, 0);
      
      recommendations.push({
        type: 'next_semester',
        title: 'Recommended for Next Semester (Term A & Term B)',
        courses: nextSemesterCourses,
        priority: 'high',
        message: `Total: ${totalCredits} credits (1 course per term). Focus on core courses to maintain progress.`
      });
    }

    // Additional elective recommendations if needed (only if student won't have enough credits to graduate)
    if (availableElectives.length > 0 && availableCoreCourses.length <= 1 && !willHaveEnoughCreditsToGraduate) {
      const electiveRecommendations = availableElectives.slice(0, 2);
      const totalCredits = electiveRecommendations.reduce((sum, course) => sum + course.credits, 0);
      
      recommendations.push({
        type: 'electives',
        title: 'Consider These Electives',
        courses: electiveRecommendations,
        priority: 'medium',
        message: `Total: ${totalCredits} credits. Good options to fill your term schedule.`
      });
    }

    // Check for missing prerequisites
    const coursesWithUnmetPrereqs = allCourses.filter(course => {
      const status = studentData.courseStatus[course.code] || '';
      if (status === 'A' || status === 'IP') return false;
      
      if (course.prerequisites && course.prerequisites.length > 0) {
        return !course.prerequisites.every(prereq => {
          if (prereq.includes('completion of')) {
            const completedCoreCredits = studyPlan.coreCourses
              .filter(c => studentData.courseStatus[c.code] === 'A')
              .reduce((sum, c) => sum + c.credits, 0);
            return completedCoreCredits >= 18;
          }
          return studentData.courseStatus[prereq] === 'A';
        });
      }
      return false;
    });

    if (coursesWithUnmetPrereqs.length > 0) {
      recommendations.push({
        type: 'prerequisites',
        title: 'Complete Prerequisites First',
        courses: coursesWithUnmetPrereqs.slice(0, 3),
        priority: 'medium',
        message: 'These courses require prerequisites that you haven\'t completed yet.'
      });
    }

    // Graduation timeline estimation (1 course per term, 2 terms per long semester)
    const coursesRemaining = Math.ceil(remainingCredits / 3); // Assuming 3 credits per course
    const termsRemaining = coursesRemaining; // 1 course per term
    const longSemestersRemaining = Math.ceil(termsRemaining / 2); // 2 terms per long semester
    const shortSemestersNeeded = termsRemaining % 2; // Remaining terms that could be taken in short semesters
    const winterCourses = Math.floor(shortSemestersNeeded / 1); // Winter semester (1 term)
    const summerCourses = Math.floor(shortSemestersNeeded / 1); // Summer semester (1 term)
    
    if (remainingCredits > 0) {
      let timelineMessage = '';
      if (longSemestersRemaining > 0) {
        timelineMessage = `Approximately ${longSemestersRemaining} long semester${longSemestersRemaining > 1 ? 's' : ''} (${termsRemaining} terms) remaining after current semester (${remainingCredits} credits left to take)`;
        if (shortSemestersNeeded > 0) {
          timelineMessage += `. You could also consider taking courses in Winter and Summer semesters to accelerate graduation.`;
        }
      } else {
        timelineMessage = `${termsRemaining} term${termsRemaining > 1 ? 's' : ''} remaining after current semester (${remainingCredits} credits left to take)`;
      }
      
      recommendations.push({
        type: 'timeline',
        title: 'Estimated Time to Graduation',
        priority: 'info',
        message: timelineMessage,
        data: { 
          semestersRemaining: longSemestersRemaining, 
          termsRemaining,
          coursesRemaining,
          remainingCredits,
          shortSemestersNeeded,
          winterCourses,
          summerCourses
        }
      });
    }

    // Short semester acceleration opportunities (Winter and Summer are separate)
    // Only suggest if student won't have enough credits to graduate
    if (shortSemestersNeeded > 0 && availableCourses.length > 0 && !willHaveEnoughCreditsToGraduate) {
      const shortSemesterCourses = availableCourses.slice(0, shortSemestersNeeded);
      const totalCredits = shortSemesterCourses.reduce((sum, course) => sum + course.credits, 0);
      
      let accelerationMessage = '';
      if (shortSemestersNeeded === 1) {
        accelerationMessage = `Take 1 course in either Winter or Summer semester to accelerate graduation by 1 term.`;
      } else if (shortSemestersNeeded === 2) {
        accelerationMessage = `Take 1 course in Winter and 1 course in Summer to accelerate graduation by 2 terms.`;
      } else {
        accelerationMessage = `Take courses in Winter and Summer semesters to accelerate graduation by ${shortSemestersNeeded} terms.`;
      }
      
      recommendations.push({
        type: 'short_semester',
        title: 'Short Semester Acceleration Opportunities',
        courses: shortSemesterCourses,
        priority: 'medium',
        message: accelerationMessage
      });
    }

    // Check graduation readiness
    if (willHaveEnoughCreditsToGraduate) {
      if (inProgressCredits > 0) {
        recommendations.push({
          type: 'graduation',
          title: 'Almost There - Complete Your Current Courses!',
          message: `You will have enough credits to graduate once you complete your current ${inProgressCredits} credits in progress. Focus on finishing these courses!`,
          priority: 'high'
        });
      } else {
        recommendations.push({
          type: 'graduation',
          title: 'Graduation Ready!',
          message: 'Congratulations! You have completed all required credits and are ready to graduate.',
          priority: 'high'
        });
      }
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
      case 'medium':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getPriorityIcon = (priority, type) => {
    switch (type) {
      case 'progress_summary':
        return <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'academic_calendar':
        return <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      case 'next_semester':
        return <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'electives':
        return <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'prerequisites':
        return <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case 'timeline':
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'short_semester':
        return <ArrowRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case 'graduation':
        return <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default:
        switch (priority) {
          case 'high':
            return <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />;
          case 'medium':
            return <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
          default:
            return <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
        }
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 pt-5 pb-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Recommendations</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">0 recommendations</span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </button>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 pb-6">
            <p className="text-gray-600 dark:text-gray-300">No specific recommendations at this time. Keep up the good work!</p>
          </div>
        </div>
      </div>
    );
  }

  const renderProgressSummary = (rec) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{rec.data.completedCredits}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{rec.data.inProgressCredits}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">In Progress</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{rec.data.remainingCredits}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Remaining</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{rec.data.totalCredits}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Total Required</div>
      </div>
    </div>
  );

  const renderTimeline = (rec) => (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${rec.data.progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>{rec.data.completedCredits + rec.data.inProgressCredits} credits completed/in-progress</span>
          <span>{rec.data.remainingCredits} remaining to take</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header with toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 pt-5 pb-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Recommendations</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''}
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
          <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
            <div className="flex items-center space-x-2 mb-3">
              {getPriorityIcon(rec.priority, rec.type)}
              <h4 className="font-medium text-gray-900 dark:text-white">{rec.title}</h4>
            </div>
            
            {/* Special rendering for progress summary */}
            {rec.type === 'progress_summary' && renderProgressSummary(rec)}
            
            {/* Special rendering for timeline */}
            {rec.type === 'timeline' && renderTimeline(rec)}
            
            {/* Course recommendations */}
            {rec.courses && (
              <div className="space-y-2">
                {rec.courses.map((course, courseIndex) => {
                  let termLabel = '';
                  if (rec.type === 'next_semester') {
                    termLabel = courseIndex === 0 ? 'Term A' : 'Term B';
                  } else if (rec.type === 'short_semester') {
                    // Alternate between Winter and Summer for multiple courses
                    if (courseIndex === 0) {
                      termLabel = 'Winter';
                    } else if (courseIndex === 1) {
                      termLabel = 'Summer';
                    } else {
                      termLabel = courseIndex % 2 === 0 ? 'Winter' : 'Summer';
                    }
                  }
                  
                  return (
                    <div key={course.code} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm text-gray-900 dark:text-white">{course.code}</span>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {course.credits} credits
                          </span>
                          {termLabel && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                              {termLabel}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{course.title}</p>
                        {course.prerequisites && course.prerequisites.length > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Prerequisites: {course.prerequisites.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {rec.message && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{rec.message}</p>
            )}
          </div>
        ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPanel;

