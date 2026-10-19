import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  GraduationCap,
  Target,
  Zap,
  Users,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

const InteractiveRoadmap = ({ studentData, studyPlan, onCourseStatusChange, selectedElectives, onElectiveChange }) => {
  const [selectedScenario, setSelectedScenario] = useState('standard');
  const [expandedSemesters, setExpandedSemesters] = useState({
    0: false, // First semester collapsed by default
    1: false, // Second semester collapsed by default
    2: false, // Third semester collapsed by default
    3: false  // Fourth semester collapsed by default
  });
  const [draggedCourse, setDraggedCourse] = useState(null);
  const [showPrerequisites, setShowPrerequisites] = useState(false);
  const [isRoadmapExpanded, setIsRoadmapExpanded] = useState(false);

  // Define the exact study plan structure based on the image
  const roadmapStructure = {
    standard: {
      name: "Standard 2-Year Plan",
      description: "Recommended full-time progression",
      semesters: [
        {
          name: "First Semester",
          terms: [
            {
              name: "Term A",
              courses: [
                { code: "EDU 501", title: "Leadership in Education: Theory and Practice", credits: 3, prerequisites: [] },
                { code: "EDU 502", title: "Institutional Enhancement and Quality Assurance", credits: 3, prerequisites: ["EDU 501"] }
              ]
            },
            {
              name: "Term B", 
              courses: [
                { code: "EDU 503", title: "Curriculum Development and Program Assessment", credits: 3, prerequisites: ["EDU 501"] },
                { code: "EDU 504", title: "Big Data and Information Systems in Education", credits: 3, prerequisites: ["EDU 501", "EDU 503"], corequisite: "EDU 503" }
              ]
            }
          ]
        },
        {
          name: "Second Semester",
          terms: [
            {
              name: "Term A",
              courses: [
                { code: "EDU 505", title: "Professional Development and Instructional Supervision", credits: 3, prerequisites: ["EDU 501", "EDU 503"] },
                { code: "EDU 506", title: "Research Methodology in Education", credits: 3, prerequisites: [] }
              ]
            },
            {
              name: "Term B",
              courses: [
                { code: "EDU 507", title: "Innovation and Entrepreneurship in Education", credits: 3, prerequisites: [] },
                { code: "ELECTIVE_1", title: "Elective 1", credits: 3, prerequisites: [], isElective: true }
              ]
            }
          ]
        },
        {
          name: "Third Semester",
          terms: [
            {
              name: "Term A",
              courses: [
                { code: "ELECTIVE_2", title: "Elective 2", credits: 3, prerequisites: [], isElective: true }
              ]
            }
          ]
        },
        {
          name: "Fourth Semester",
          terms: [
            {
              name: "Full Semester",
              courses: [
                { code: "EDU 580", title: "Thesis", credits: 6, prerequisites: ["EDU 506", "18_CORE_CREDITS"] }
              ]
            }
          ]
        }
      ]
    },
    accelerated: {
      name: "Accelerated 1.5-Year Plan",
      description: "Complete program in 3 semesters with summer courses",
      semesters: [
        {
          name: "First Semester",
          terms: [
            {
              name: "Term A",
              courses: [
                { code: "EDU 501", title: "Leadership in Education: Theory and Practice", credits: 3, prerequisites: [] },
                { code: "EDU 502", title: "Institutional Enhancement and Quality Assurance", credits: 3, prerequisites: ["EDU 501"] }
              ]
            },
            {
              name: "Term B",
              courses: [
                { code: "EDU 503", title: "Curriculum Development and Program Assessment", credits: 3, prerequisites: ["EDU 501"] },
                { code: "EDU 504", title: "Big Data and Information Systems in Education", credits: 3, prerequisites: ["EDU 501", "EDU 503"], corequisite: "EDU 503" }
              ]
            }
          ]
        },
        {
          name: "Second Semester",
          terms: [
            {
              name: "Term A",
              courses: [
                { code: "EDU 505", title: "Professional Development and Instructional Supervision", credits: 3, prerequisites: ["EDU 501", "EDU 503"] },
                { code: "EDU 506", title: "Research Methodology in Education", credits: 3, prerequisites: [] }
              ]
            },
            {
              name: "Term B",
              courses: [
                { code: "EDU 507", title: "Innovation and Entrepreneurship in Education", credits: 3, prerequisites: [] },
                { code: "ELECTIVE_1", title: "Elective 1", credits: 3, prerequisites: [], isElective: true }
              ]
            }
          ]
        },
        {
          name: "Summer Semester",
          terms: [
            {
              name: "Summer Term",
              courses: [
                { code: "ELECTIVE_2", title: "Elective 2", credits: 3, prerequisites: [], isElective: true }
              ]
            }
          ]
        },
        {
          name: "Third Semester",
          terms: [
            {
              name: "Full Semester",
              courses: [
                { code: "EDU 580", title: "Thesis", credits: 6, prerequisites: ["EDU 506", "18_CORE_CREDITS"] }
              ]
            }
          ]
        }
      ]
    },
    partTime: {
      name: "Part-Time 3-Year Plan",
      description: "Flexible schedule for working professionals",
      semesters: [
        {
          name: "First Semester",
          terms: [
            {
              name: "Term A",
              courses: [
                { code: "EDU 501", title: "Leadership in Education: Theory and Practice", credits: 3, prerequisites: [] }
              ]
            },
            {
              name: "Term B",
              courses: [
                { code: "EDU 503", title: "Curriculum Development and Program Assessment", credits: 3, prerequisites: ["EDU 501"] }
              ]
            }
          ]
        },
        {
          name: "Second Semester",
          terms: [
            {
              name: "Term A",
              courses: [
                { code: "EDU 502", title: "Institutional Enhancement and Quality Assurance", credits: 3, prerequisites: ["EDU 501"] }
              ]
            },
            {
              name: "Term B",
              courses: [
                { code: "EDU 504", title: "Big Data and Information Systems in Education", credits: 3, prerequisites: ["EDU 501", "EDU 503"], corequisite: "EDU 503" }
              ]
            }
          ]
        },
        {
          name: "Third Semester",
          terms: [
            {
              name: "Term A",
              courses: [
                { code: "EDU 505", title: "Professional Development and Instructional Supervision", credits: 3, prerequisites: ["EDU 501", "EDU 503"] }
              ]
            },
            {
              name: "Term B",
              courses: [
                { code: "EDU 506", title: "Research Methodology in Education", credits: 3, prerequisites: [] }
              ]
            }
          ]
        },
        {
          name: "Fourth Semester",
          terms: [
            {
              name: "Term A",
              courses: [
                { code: "EDU 507", title: "Innovation and Entrepreneurship in Education", credits: 3, prerequisites: [] }
              ]
            },
            {
              name: "Term B",
              courses: [
                { code: "ELECTIVE_1", title: "Elective 1", credits: 3, prerequisites: [], isElective: true }
              ]
            }
          ]
        },
        {
          name: "Fifth Semester",
          terms: [
            {
              name: "Term A",
              courses: [
                { code: "ELECTIVE_2", title: "Elective 2", credits: 3, prerequisites: [], isElective: true }
              ]
            }
          ]
        },
        {
          name: "Sixth Semester",
          terms: [
            {
              name: "Full Semester",
              courses: [
                { code: "EDU 580", title: "Thesis", credits: 6, prerequisites: ["EDU 506", "18_CORE_CREDITS"] }
              ]
            }
          ]
        }
      ]
    }
  };

  // Available electives
  const availableElectives = [
    { code: "EDU 520", title: "Pedagogies for Diversity", credits: 3, prerequisites: [] },
    { code: "EDU 521", title: "Ethical Leadership and Decision Making in Educational Contexts", credits: 3, prerequisites: [] },
    { code: "EDU 522", title: "Comparative Education", credits: 3, prerequisites: [] },
    { code: "EDU 523", title: "Contemporary Trends and Issues in Educational Leadership", credits: 3, prerequisites: [] }
  ];

  const getCourseStatus = (courseCode) => {
    if (courseCode.startsWith('ELECTIVE_')) return '';
    return studentData?.courseStatus?.[courseCode] || '';
  };

  const getCourseGrade = (courseCode) => {
    if (courseCode.startsWith('ELECTIVE_')) return '';
    return studentData?.grades?.[courseCode] || '';
  };

  const checkPrerequisites = (course) => {
    if (!course.prerequisites || course.prerequisites.length === 0) return { met: true, missing: [] };
    
    const missing = course.prerequisites.filter(prereq => {
      if (prereq === '18_CORE_CREDITS') {
        // Check if 18 core credits are completed
        const coreCredits = studyPlan?.coreCourses?.reduce((total, coreCourse) => {
          const status = getCourseStatus(coreCourse.code);
          return status === 'A' ? total + coreCourse.credits : total;
        }, 0) || 0;
        return coreCredits < 18;
      }
      return getCourseStatus(prereq) !== 'A';
    });

    return { met: missing.length === 0, missing };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'A': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'IP': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'X': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'P': return <Target className="h-4 w-4 text-blue-600" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'A': return 'bg-green-50 border-green-200 text-green-800';
      case 'IP': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'X': return 'bg-red-50 border-red-200 text-red-800';
      case 'P': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  const toggleSemester = (semesterIndex) => {
    setExpandedSemesters(prev => ({
      ...prev,
      [semesterIndex]: !prev[semesterIndex]
    }));
  };

  const handleDragStart = (e, course) => {
    setDraggedCourse(course);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetTerm, targetSemester, targetElectiveSlot) => {
    e.preventDefault();
    if (draggedCourse && targetElectiveSlot) {
      onElectiveChange(targetElectiveSlot, draggedCourse);
    }
    setDraggedCourse(null);
  };

  const handleElectiveSelection = (electiveSlot, elective) => {
    onElectiveChange(electiveSlot, elective);
  };

  const handleElectiveUnselection = (electiveSlot) => {
    onElectiveChange(electiveSlot, null);
  };

  const handleElectiveChange = (electiveSlot, newElective) => {
    onElectiveChange(electiveSlot, newElective);
  };

  const getElectiveForSlot = (electiveSlot) => {
    return selectedElectives[electiveSlot] || null;
  };

  const currentScenario = roadmapStructure[selectedScenario];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <button
        onClick={() => setIsRoadmapExpanded(!isRoadmapExpanded)}
        className="w-full flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Interactive Study Roadmap
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Visualize your academic journey and plan your course progression
          </p>
          {!isRoadmapExpanded && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Click to expand roadmap • {currentScenario.name}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isRoadmapExpanded && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const allExpanded = Object.values(expandedSemesters).every(expanded => expanded);
                  const newState = {};
                  Object.keys(expandedSemesters).forEach(key => {
                    newState[key] = !allExpanded;
                  });
                  setExpandedSemesters(newState);
                }}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {Object.values(expandedSemesters).every(expanded => expanded) ? 'Collapse All' : 'Expand All'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPrerequisites(!showPrerequisites);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  showPrerequisites 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <Info className="h-3 w-3 mr-1 inline" />
                Prerequisites
              </button>
            </>
          )}
          {isRoadmapExpanded ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </div>
      </button>

      {/* Collapsible Content */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isRoadmapExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        {/* Scenario Selector */}
        <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.entries(roadmapStructure).map(([key, scenario]) => (
            <button
              key={key}
              onClick={() => setSelectedScenario(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedScenario === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {scenario.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {currentScenario.description}
        </p>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-4">
        {currentScenario.semesters.map((semester, semesterIndex) => (
          <div key={semesterIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <button
              onClick={() => toggleSemester(semesterIndex)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-t-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {semesterIndex + 1}
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{semester.name}</h4>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {semester.terms.reduce((total, term) => total + term.courses.length, 0)} courses
                  </span>
                  <span className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    {semester.terms.reduce((total, term) => 
                      total + term.courses.reduce((termTotal, course) => termTotal + course.credits, 0), 0
                    )} credits
                  </span>
                </div>
                {!expandedSemesters[semesterIndex] && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Click to view courses</span>
                    {(() => {
                      const completedInSemester = semester.terms.reduce((total, term) => 
                        total + term.courses.filter(course => {
                          if (course.code.startsWith('ELECTIVE_')) {
                            // For elective slots, check if an elective is selected
                            const electiveSlot = course.code;
                            return selectedElectives[electiveSlot] !== null;
                          }
                          const status = getCourseStatus(course.code);
                          return status === 'A';
                        }).length, 0
                      );
                      const totalInSemester = semester.terms.reduce((total, term) => total + term.courses.length, 0);
                      if (completedInSemester > 0) {
                        return (
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            ({completedInSemester}/{totalInSemester} completed)
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>
              {expandedSemesters[semesterIndex] ? 
                <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                <ChevronDown className="h-5 w-5 text-gray-500" />
              }
            </button>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              expandedSemesters[semesterIndex] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="p-4 space-y-4">
                {semester.terms.map((term, termIndex) => (
                  <div key={termIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                      {term.name}
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {term.courses.map((course, courseIndex) => {
                        // Handle elective slots
                        let displayCourse = course;
                        if (course.isElective) {
                          const selectedElective = getElectiveForSlot(course.code);
                          if (selectedElective) {
                            displayCourse = {
                              ...selectedElective,
                              isElective: true,
                              originalSlot: course.code
                            };
                          }
                        }

                        const status = getCourseStatus(displayCourse.code);
                        const grade = getCourseGrade(displayCourse.code);
                        const prereqCheck = checkPrerequisites(displayCourse);
                        
                        return (
                          <div
                            key={courseIndex}
                            draggable={course.isElective && !displayCourse.code.startsWith('ELECTIVE_')}
                            onDragStart={(e) => course.isElective && handleDragStart(e, displayCourse)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => course.isElective && handleDrop(e, term.name, semester.name, course.code)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              course.isElective 
                                ? 'border-dashed border-gray-300 hover:border-blue-400 cursor-move' 
                                : 'border-solid'
                            } ${getStatusColor(status)}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(status)}
                                <span className="font-medium text-sm">{displayCourse.code}</span>
                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                  {displayCourse.credits} credits
                                </span>
                              </div>
                              {course.isElective && (
                                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                                  Elective
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm mb-2">{displayCourse.title}</p>
                            
                            {course.isElective && !displayCourse.code.startsWith('ELECTIVE_') && (
                              <div className="text-xs mb-2">
                                <span className="font-medium text-green-600">✓ Elective Selected</span>
                              </div>
                            )}
                            
                            {course.isElective && displayCourse.code.startsWith('ELECTIVE_') && (
                              <div className="text-xs mb-2">
                                <span className="font-medium text-gray-500">Click to select elective</span>
                              </div>
                            )}
                            
                            {showPrerequisites && displayCourse.prerequisites && displayCourse.prerequisites.length > 0 && (
                              <div className="text-xs mb-2">
                                <span className="font-medium">Prerequisites: </span>
                                <span className={prereqCheck.met ? 'text-green-600' : 'text-red-600'}>
                                  {displayCourse.prerequisites.join(', ')}
                                </span>
                                {displayCourse.corequisite && (
                                  <span className="text-blue-600 ml-1">
                                    (Co: {displayCourse.corequisite})
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {status === 'A' && grade && (
                              <div className="text-xs">
                                <span className="font-medium">Grade: </span>
                                <span className="font-semibold">{grade}</span>
                              </div>
                            )}
                            
                            {!status && (
                              <div className="text-xs">
                                <span className="font-medium text-gray-500">(Pending)</span>
                              </div>
                            )}
                            
                            {!prereqCheck.met && (
                              <div className="text-xs text-red-600 mt-1">
                                Missing: {prereqCheck.missing.join(', ')}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prerequisite Visualization */}
      {showPrerequisites && (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="h-4 w-4 mr-2 text-orange-600" />
            Course Prerequisites Flow
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="space-y-4">
              {/* First Level - No Prerequisites */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 w-full">Foundation Courses (No Prerequisites):</span>
                {['EDU 501', 'EDU 506', 'EDU 507'].map(course => (
                  <div key={course} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md text-sm">
                    {course}
                  </div>
                ))}
              </div>
              
              {/* Second Level - EDU 501 Prerequisite */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 w-full">Requires EDU 501:</span>
                {['EDU 502', 'EDU 503'].map(course => (
                  <div key={course} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-sm">
                    {course}
                  </div>
                ))}
              </div>
              
              {/* Third Level - Multiple Prerequisites */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 w-full">Requires EDU 501 + EDU 503:</span>
                {['EDU 504', 'EDU 505'].map(course => (
                  <div key={course} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-md text-sm">
                    {course}
                  </div>
                ))}
              </div>
              
              {/* Final Level - Thesis */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 w-full">Requires EDU 506 + 18 Core Credits:</span>
                <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-md text-sm">
                  EDU 580 (Thesis)
                </div>
              </div>
              
              {/* Electives */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 w-full">Electives (No Prerequisites):</span>
                {availableElectives.map(elective => (
                  <div key={elective.code} className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm">
                    {elective.code}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Elective Selection Panel */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Users className="h-4 w-4 mr-2 text-purple-600" />
            Available Electives (Choose 2)
          </h4>
          {Object.values(selectedElectives).some(elective => elective !== null) && (
            <button
              onClick={() => {
                onElectiveChange('ELECTIVE_1', null);
                onElectiveChange('ELECTIVE_2', null);
              }}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium px-3 py-1 rounded border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {availableElectives.map((elective, index) => {
            const isSelected = Object.values(selectedElectives).some(selected => 
              selected && selected.code === elective.code
            );
            const isUsed = Object.values(selectedElectives).some(selected => 
              selected && selected.code === elective.code
            );
            
            return (
              <div
                key={index}
                draggable={!isUsed}
                onDragStart={(e) => !isUsed && handleDragStart(e, elective)}
                className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
                    : isUsed
                    ? 'border-gray-300 bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 dark:border-gray-600 bg-purple-50 dark:bg-purple-900/20 hover:border-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                }`}
                onClick={() => {
                  if (isSelected) {
                    // If already selected, unselect it
                    const currentSlot = Object.keys(selectedElectives).find(slot => 
                      selectedElectives[slot] && selectedElectives[slot].code === elective.code
                    );
                    if (currentSlot) {
                      handleElectiveUnselection(currentSlot);
                    }
                  } else if (!isUsed) {
                    // Find first empty slot or replace an existing selection
                    const emptySlot = Object.keys(selectedElectives).find(slot => 
                      !selectedElectives[slot]
                    );
                    if (emptySlot) {
                      handleElectiveSelection(emptySlot, elective);
                    } else {
                      // If no empty slots, replace the first selection
                      handleElectiveChange('ELECTIVE_1', elective);
                    }
                  }
                }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-sm">{elective.code}</span>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    {elective.credits} credits
                  </span>
                  {isSelected && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{elective.title}</p>
                {isSelected && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Click to unselect
                  </p>
                )}
                {!isUsed && !isSelected && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Click or drag to select
                  </p>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Elective Assignment Summary */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Elective Assignment:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(selectedElectives).map(([slot, elective]) => (
              <div key={slot} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {slot === 'ELECTIVE_1' ? 'Elective 1 (Second Semester, Term B):' : 'Elective 2 (Third Semester, Term A):'}
                  </span>
                  {elective ? (
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {elective.code} - {elective.title}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Not selected
                    </span>
                  )}
                </div>
                {elective && (
                  <button
                    onClick={() => handleElectiveUnselection(slot)}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Remove this elective"
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
          <GraduationCap className="h-4 w-4 mr-2" />
          Program Progress Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {studyPlan?.coreCourses?.filter(course => getCourseStatus(course.code) === 'A').length || 0}
            </div>
            <div className="text-blue-700 dark:text-blue-200">Core Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {Object.keys(studentData?.courseStatus || {}).filter(code => 
                availableElectives.some(elective => elective.code === code) && 
                getCourseStatus(code) === 'A'
              ).length}
            </div>
            <div className="text-blue-700 dark:text-blue-200">Electives Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {getCourseStatus('EDU 580') === 'A' ? 'Yes' : 'No'}
            </div>
            <div className="text-blue-700 dark:text-blue-200">Thesis Status</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {currentScenario.semesters.length}
            </div>
            <div className="text-blue-700 dark:text-blue-200">Total Semesters</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default InteractiveRoadmap;
