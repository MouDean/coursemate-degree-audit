import React, { useState, useEffect } from 'react';
import { User, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import registrationRequestService from '../services/registrationRequestService';

const AdvisorDashboard = ({ advisorData, onLogout, onSwitchToStudent }) => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    loadRequests();
    loadStats();
  }, []);

  const loadRequests = () => {
    const allRequests = registrationRequestService.getAdvisorRequests(advisorData.id);
    setRequests(allRequests);
  };

  const loadStats = () => {
    const requestStats = registrationRequestService.getRequestStats();
    setStats(requestStats);
  };

  const handleApproveRequest = async (requestId) => {
    setSelectedRequest(requests.find(r => r.id === requestId));
    setResponseMessage('');
    setActionType('approve');
  };

  const handleRejectRequest = async (requestId) => {
    setSelectedRequest(requests.find(r => r.id === requestId));
    setResponseMessage('');
    setActionType('reject');
  };

  const handleRequestResponse = async (requestId, status) => {
    if (!responseMessage.trim() && status === 'rejected') {
      alert('Please provide a reason for rejection.');
      return;
    }

    setIsResponding(true);
    try {
      const response = responseMessage.trim() || 
        (status === 'approved' ? 'Your registration request has been approved. You will be registered for this course when registration opens.' : '');
      
      registrationRequestService.updateRequestStatus(requestId, status, response, advisorData.id);
      
      // Reset form
      setSelectedRequest(null);
      setResponseMessage('');
      setActionType('');
      
      // Reload data
      loadRequests();
      loadStats();
      
      alert(`Request ${status} successfully!`);
    } catch (error) {
      alert('Failed to update request. Please try again.');
    } finally {
      setIsResponding(false);
    }
  };

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

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Logo className="h-20 w-20" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">CourseMate</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{advisorData.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{advisorData.department} | {advisorData.specialization}</p>
                </div>
              </div>
              
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="text-sm">{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Approved</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Management */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  Pending ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedRequests.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No pending requests at the moment.</p>
                  </div>
                ) : (
                  pendingRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {request.courseCode} - {request.courseTitle}
                            </h3>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)} {request.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <p><strong>Student:</strong> {request.studentName} (ID: {request.studentId})</p>
                            <p><strong>Credits:</strong> {request.courseCredits}</p>
                            <p><strong>Submitted:</strong> {formatDate(request.submittedAt)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student Message:</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{request.message}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isResponding}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectRequest(request.id)}
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          disabled={isResponding}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No approved requests yet.</p>
                  </div>
                ) : (
                  approvedRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {request.courseCode} - {request.courseTitle}
                            </h3>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)} {request.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <p><strong>Student:</strong> {request.studentName} (ID: {request.studentId})</p>
                            <p><strong>Approved:</strong> {formatDate(request.respondedAt)}</p>
                          </div>
                        </div>
                      </div>

                      {request.advisorResponse && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Your Response:</h4>
                          <p className="text-sm text-green-700 dark:text-green-300">{request.advisorResponse}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                {rejectedRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No rejected requests yet.</p>
                  </div>
                ) : (
                  rejectedRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {request.courseCode} - {request.courseTitle}
                            </h3>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)} {request.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <p><strong>Student:</strong> {request.studentName} (ID: {request.studentId})</p>
                            <p><strong>Rejected:</strong> {formatDate(request.respondedAt)}</p>
                          </div>
                        </div>
                      </div>

                      {request.advisorResponse && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Rejection Reason:</h4>
                          <p className="text-sm text-red-700 dark:text-red-300">{request.advisorResponse}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Response Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>
                  {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="response-message">
                    {actionType === 'approve' ? 'Comment (Optional)' : 'Reason for Rejection'}
                  </Label>
                  <Textarea
                    id="response-message"
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder={
                      actionType === 'approve' 
                        ? "Add a comment for the student (optional)..." 
                        : "Please provide a reason for rejecting this request..."
                    }
                    className="mt-1"
                    rows={4}
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleRequestResponse(selectedRequest.id, actionType === 'approve' ? 'approved' : 'rejected')}
                    className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                    disabled={isResponding || (actionType === 'reject' && !responseMessage.trim())}
                  >
                    {isResponding 
                      ? (actionType === 'approve' ? 'Approving...' : 'Rejecting...') 
                      : (actionType === 'approve' ? 'Approve Request' : 'Reject Request')
                    }
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRequest(null);
                      setResponseMessage('');
                      setActionType('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisorDashboard;
