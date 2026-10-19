// Registration Request Service
// Handles course registration requests between students and advisors

class RegistrationRequestService {
  constructor() {
    this.requests = this.loadRequests();
    this.advisors = this.loadAdvisors();
  }

  // Load requests from localStorage
  loadRequests() {
    try {
      const stored = localStorage.getItem('registration_requests');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading registration requests:', error);
      return [];
    }
  }

  // Save requests to localStorage
  saveRequests() {
    try {
      localStorage.setItem('registration_requests', JSON.stringify(this.requests));
    } catch (error) {
      console.error('Error saving registration requests:', error);
    }
  }

  // Load advisors from localStorage
  loadAdvisors() {
    try {
      const stored = localStorage.getItem('academic_advisors');
      return stored ? JSON.parse(stored) : this.getDefaultAdvisors();
    } catch (error) {
      console.error('Error loading advisors:', error);
      return this.getDefaultAdvisors();
    }
  }

  // Get default advisors
  getDefaultAdvisors() {
    return [{ id: 'advisor_001', name: 'Demo Advisor',
      email: 'advisor@example.org', username: 'demo-advisor',
      department: 'Education', specialization: 'Educational Leadership', students: [] }];
  }

  // Submit a new registration request
  submitRequest(requestData) {
    const newRequest = {
      id: Date.now().toString(),
      ...requestData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      advisorResponse: null,
      respondedAt: null,
      assignedAdvisor: this.assignAdvisor(requestData.studentId)
    };

    this.requests.push(newRequest);
    this.saveRequests();
    
    // Notify advisor (in real app, this would be an email/notification)
    this.notifyAdvisor(newRequest);
    
    return newRequest;
  }

  // Assign advisor to student (simple round-robin assignment)
  assignAdvisor(studentId) {
    const advisors = this.advisors;
    const studentHash = studentId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const advisorIndex = studentHash % advisors.length;
    return advisors[advisorIndex].id;
  }

  // Get requests for a specific student
  getStudentRequests(studentId) {
    return this.requests.filter(request => request.studentId === studentId);
  }

  // Get requests for a specific advisor
  getAdvisorRequests(advisorId) {
    return this.requests.filter(request => request.assignedAdvisor === advisorId);
  }

  // Get all pending requests
  getPendingRequests() {
    return this.requests.filter(request => request.status === 'pending');
  }

  // Update request status (advisor response)
  updateRequestStatus(requestId, status, response, advisorId) {
    const request = this.requests.find(r => r.id === requestId);
    if (request) {
      request.status = status;
      request.advisorResponse = response;
      request.respondedAt = new Date().toISOString();
      request.respondedBy = advisorId;
      
      this.saveRequests();
      
      // Notify student (in real app, this would be an email/notification)
      this.notifyStudent(request);
      
      return request;
    }
    return null;
  }

  // Get advisor by ID
  getAdvisor(advisorId) {
    return this.advisors.find(advisor => advisor.id === advisorId);
  }

  // Get all advisors
  getAllAdvisors() {
    return this.advisors;
  }

  // Simulate advisor notification (in real app, this would send email)
  notifyAdvisor(request) {
    const advisor = this.getAdvisor(request.assignedAdvisor);
    console.log(`📧 Notification sent to ${advisor.name} (${advisor.email}): New registration request from ${request.studentName} for ${request.courseCode}`);
    
    // Create email content
    const emailSubject = `New Course Registration Request - ${request.courseCode}`;
    const emailBody = `
Dear ${advisor.name},

A new course registration request has been submitted:

Student: ${request.studentName} (ID: ${request.studentId})
Course: ${request.courseCode} - ${request.courseTitle}
Credits: ${request.courseCredits}
Message: ${request.message}

Please review and respond to this request.

Best regards,
Student Registration System
    `.trim();

    // Create mailto link for immediate email sending
    const mailtoLink = `mailto:${advisor.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    // Public demo: do not open an email client or transmit records.
    void mailtoLink;
    
    // In a real application, this would:
    // 1. Send email to advisor via email service
    // 2. Add notification to advisor dashboard
    // 3. Send SMS if urgent
    // 4. Update advisor's notification center
  }

  // Simulate student notification (in real app, this would send email)
  notifyStudent(request) {
    console.log(`📧 Notification sent to student ${request.studentName}: Your registration request for ${request.courseCode} has been ${request.status}`);
    
    // In a real application, this would:
    // 1. Send email to student
    // 2. Add notification to student dashboard
    // 3. Send SMS if urgent
    // 4. Update student's notification center
  }

  // Get request statistics
  getRequestStats() {
    const total = this.requests.length;
    const pending = this.requests.filter(r => r.status === 'pending').length;
    const approved = this.requests.filter(r => r.status === 'approved').length;
    const rejected = this.requests.filter(r => r.status === 'rejected').length;

    return {
      total,
      pending,
      approved,
      rejected,
      approvalRate: total > 0 ? (approved / total * 100).toFixed(1) : 0
    };
  }

  // Get course request statistics
  getCourseRequestStats() {
    const courseStats = {};
    
    this.requests.forEach(request => {
      const courseCode = request.courseCode;
      if (!courseStats[courseCode]) {
        courseStats[courseCode] = {
          courseCode,
          courseTitle: request.courseTitle,
          totalRequests: 0,
          approved: 0,
          rejected: 0,
          pending: 0
        };
      }
      
      courseStats[courseCode].totalRequests++;
      courseStats[courseCode][request.status]++;
    });

    return Object.values(courseStats);
  }

  // Clear all requests (for testing/admin purposes)
  clearAllRequests() {
    this.requests = [];
    this.saveRequests();
  }

  // Export requests data
  exportRequests() {
    return {
      requests: this.requests,
      advisors: this.advisors,
      stats: this.getRequestStats(),
      courseStats: this.getCourseRequestStats(),
      exportedAt: new Date().toISOString()
    };
  }

  // Import requests data
  importRequests(data) {
    try {
      if (data.requests) this.requests = data.requests;
      if (data.advisors) this.advisors = data.advisors;
      this.saveRequests();
      return true;
    } catch (error) {
      console.error('Error importing requests:', error);
      return false;
    }
  }
}

// Create singleton instance
const registrationRequestService = new RegistrationRequestService();

export default registrationRequestService;
