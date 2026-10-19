import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import registrationRequestService from '../services/registrationRequestService';

const CourseRegistrationRequest = ({ studentData, studyPlan }) => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [requestType, setRequestType] = useState('registration');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestHistory, setRequestHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const requestTypes = useMemo(() => [
    { value: 'registration', label: 'Course Registration', description: 'Request to register for a specific course' },
    { value: 'exception', label: 'Exception Request', description: 'Request for an exception to academic policies' },
    { value: 'substitution', label: 'Course Substitution', description: 'Request to substitute one course for another' },
    { value: 'prerequisite', label: 'Prerequisite Waiver', description: 'Request to waive course prerequisites' },
    { value: 'overload', label: 'Credit Overload', description: 'Request to take more than the maximum credit hours' },
    { value: 'other', label: 'Other Request', description: 'Any other academic request' }
  ], []);

  const loadAvailableCourses = useCallback(() => {
    if (!studentData || !studyPlan) return;

    // Get courses that are not yet completed or in progress
    const completedCourses = Object.keys(studentData.courses || {})
      .filter(code => studentData.courses[code].status === 'A');

    const allCourses = [
      ...(studyPlan.coreCourses || []),
      ...(studyPlan.electives || []),
      ...(studyPlan.preCoreCourses || [])
    ];

    const available = allCourses.filter(course => 
      !completedCourses.includes(course.code) && 
      course.code !== selectedCourse
    );

    setAvailableCourses(available);
  }, [studentData, studyPlan, selectedCourse]);

  const loadRequestHistory = useCallback(() => {
    if (!studentData) return;
    // Load from registration request service
    const history = registrationRequestService.getStudentRequests(studentData.id);
    setRequestHistory(history);
  }, [studentData]);

  useEffect(() => {
    if (studentData && studyPlan) {
      loadAvailableCourses();
      loadRequestHistory();
    }
  }, [studentData, studyPlan, loadAvailableCourses, loadRequestHistory]);

  const handleSubmitRequest = useCallback(async () => {
    // Validation based on request type
    if (requestType === 'registration' && !selectedCourse) {
      setSubmitStatus({ type: 'error', message: 'Please select a course for registration.' });
      return;
    }
    
    if (!requestMessage.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please provide a message explaining your request.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const course = availableCourses.find(c => c.code === selectedCourse);
      const requestData = {
        requestType: requestType,
        courseCode: selectedCourse || null,
        courseTitle: course?.title || selectedCourse || null,
        courseCredits: course?.credits || null,
        studentId: studentData.id,
        studentName: studentData.name,
        message: requestMessage.trim()
      };

      // Submit request through service
      registrationRequestService.submitRequest(requestData);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const requestTypeLabel = requestTypes.find(rt => rt.value === requestType)?.label || 'Request';
      setSubmitStatus({ 
        type: 'success', 
        message: `${requestTypeLabel} has been sent to your academic advisor.` 
      });

      // Reset form and reload data
      setSelectedCourse('');
      setRequestMessage('');
      setRequestType('registration');
      loadAvailableCourses();
      loadRequestHistory();

    } catch {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Failed to submit request. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [requestType, selectedCourse, requestMessage, availableCourses, studentData, requestTypes, loadAvailableCourses, loadRequestHistory]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* New Request Form */}
      <Card className="mx-2 md:mx-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Submit Academic Request</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              📋 Academic Request Process
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Select the type of request you want to submit</li>
              <li>• {requestType === 'registration' ? 'Choose a course and ' : ''}Provide detailed information about your request</li>
              <li>• Your academic advisor will review and respond</li>
              <li>• You'll receive notification of the decision</li>
            </ul>
          </div>

          {/* Request Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="request-type" className="text-sm font-medium">Request Type</Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger 
                className="h-12 min-h-[48px] touch-manipulation"
                aria-label="Select the type of academic request"
                aria-describedby="request-type-description"
              >
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className="h-auto py-3">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{type.label}</span>
                      <span className="text-sm text-gray-500">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {requestType === 'registration' && (
                <div className="space-y-2">
                  <Label htmlFor="course-select" className="text-sm font-medium">Select Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger 
                      className="h-12 min-h-[48px] touch-manipulation"
                      aria-label="Select a course to register for"
                      aria-describedby="course-select-description"
                    >
                      <SelectValue placeholder="Choose a course to request">
                        {selectedCourse && (() => {
                          const course = availableCourses.find(c => c.code === selectedCourse);
                          return course ? (
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{course.code}</span>
                              <span className="text-sm text-gray-500">{course.title}</span>
                            </div>
                          ) : selectedCourse;
                        })()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableCourses.map(course => (
                        <SelectItem key={course.code} value={course.code} className="h-auto py-3">
                          <div className="flex flex-col items-start">
                            <span className="font-medium text-gray-900 dark:text-white">{course.code}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{course.title}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{course.credits} credits</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

            <div className="space-y-2">
              <Label htmlFor="course-info" className="text-sm font-medium">
                {requestType === 'registration' ? 'Course Information' : 'Request Information'}
              </Label>
              {requestType === 'registration' && selectedCourse && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {(() => {
                    const course = availableCourses.find(c => c.code === selectedCourse);
                    return course ? (
                      <div className="space-y-2">
                        <div className="font-medium text-gray-900 dark:text-white">{course.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {course.credits} credits
                        </div>
                        {course.prerequisites && course.prerequisites.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Prerequisites: {course.prerequisites.join(', ')}
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
              {requestType !== 'registration' && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {requestTypes.find(rt => rt.value === requestType)?.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="request-message" className="text-sm font-medium">Request Message</Label>
            <Textarea
              id="request-message"
              placeholder={
                requestType === 'registration' 
                  ? "Please explain why you want to register for this course and any relevant information for your advisor..."
                  : requestType === 'exception'
                  ? "Please explain the exception you're requesting and provide supporting documentation or circumstances..."
                  : requestType === 'substitution'
                  ? "Please specify which course you want to substitute and which course you want to use as a replacement..."
                  : requestType === 'prerequisite'
                  ? "Please explain why you believe the prerequisite should be waived and provide any relevant experience or qualifications..."
                  : requestType === 'overload'
                  ? "Please explain why you need to exceed the maximum credit hours and how you plan to manage the additional workload..."
                  : "Please provide details about your request and any relevant information for your advisor..."
              }
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              className="min-h-[120px] resize-none touch-manipulation"
              aria-label="Request message"
              aria-describedby="request-message-description"
              required
            />
            <p id="request-message-description" className="text-xs text-gray-500">
              Be specific about your reasons and any special circumstances. Include supporting documentation if applicable.
            </p>
          </div>

          {submitStatus && (
            <Alert className={submitStatus.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <AlertDescription className={submitStatus.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                {submitStatus.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-2">
            <Button 
              onClick={handleSubmitRequest}
              disabled={(requestType === 'registration' && !selectedCourse) || !requestMessage.trim() || isSubmitting}
              className="w-full h-12 min-h-[48px] touch-manipulation"
              aria-label="Submit academic request"
              type="submit"
            >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Request...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send {requestTypes.find(rt => rt.value === requestType)?.label || 'Request'}
              </>
            )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Request History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Request History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requestHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <svg className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No requests yet.</p>
              <p className="text-sm">Submit your first request above to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requestHistory.map((request) => (
                <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {request.requestType && request.requestType !== 'registration' 
                            ? requestTypes.find(rt => rt.value === request.requestType)?.label || 'Request'
                            : `${request.courseCode} - ${request.courseTitle}`
                          }
                        </h4>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)} {request.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {request.requestType === 'registration' && request.courseCredits ? `${request.courseCredits} credits • ` : ''}Submitted {formatDate(request.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Message:</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      {request.message}
                    </p>
                  </div>

                  {request.advisorResponse && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Advisor Response:</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                        {request.advisorResponse}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Responded {formatDate(request.respondedAt)}
                      </p>
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⏳ Your request is being reviewed by your academic advisor.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(CourseRegistrationRequest);
