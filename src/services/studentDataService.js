import { studentDatabase, availableCourses } from '../data/studentDatabase.js';

// Student Data Service - Manages all student data from Excel import
class StudentDataService {
  constructor() {
    this.students = studentDatabase; // Pre-populated with your Excel data
    this.currentStudent = null;
    this.availableCourses = availableCourses;
    this.loadFromStorage();
  }

  // Load data from localStorage
  loadFromStorage() {
    try {
      const savedData = localStorage.getItem('medelAllStudents');
      if (savedData) {
        const data = JSON.parse(savedData);
        // Only use localStorage data if it has the same number of students as our database
        // This ensures we always use the latest database structure
        if (data.students && data.students.length === this.students.length) {
          this.students = data.students || [];
          this.currentStudent = data.currentStudent || null;
        } else {
          // Clear localStorage if data structure doesn't match
          localStorage.removeItem('medelAllStudents');
          console.log('Cleared old localStorage data, using fresh database');
        }
      }
    } catch (error) {
      console.error('Error loading student data:', error);
      this.students = [];
      this.currentStudent = null;
    }
  }

  // Save data to localStorage
  saveToStorage() {
    try {
      const data = {
        students: this.students,
        currentStudent: this.currentStudent,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('medelAllStudents', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving student data:', error);
    }
  }

  // Import students from Excel data
  importStudentsFromExcel(excelData) {
    try {
      const { students, courses } = this.processExcelData(excelData);
      
      // Merge with existing students (update if exists, add if new)
      students.forEach(newStudent => {
        const existingIndex = this.students.findIndex(s => s.id === newStudent.id);
        if (existingIndex >= 0) {
          // Update existing student
          this.students[existingIndex] = {
            ...this.students[existingIndex],
            ...newStudent,
            lastUpdated: new Date().toISOString()
          };
        } else {
          // Add new student
          this.students.push({
            ...newStudent,
            importedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          });
        }
      });

      // Store available courses globally
      this.availableCourses = courses;
      
      this.saveToStorage();
      return { students: this.students, courses };
    } catch (error) {
      console.error('Error importing students:', error);
      throw error;
    }
  }

  // Process Excel data (similar to StudentTranscriptImporter but as service)
  processExcelData(jsonData) {
    if (!jsonData || jsonData.length < 2) return { students: [], courses: [] };
    
    // Find header row
    let headerRowIndex = 0;
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row.some(cell => 
        cell && cell.toString().toLowerCase().includes('id') && 
        cell.toString().toLowerCase().includes('name')
      )) {
        headerRowIndex = i;
        break;
      }
    }
    
    const headers = jsonData[headerRowIndex];
    const dataRows = jsonData.slice(headerRowIndex + 1);
    
    // Find column indices
    const idIndex = headers.findIndex(h => 
      h && h.toString().toLowerCase().includes('id')
    );
    const nameIndex = headers.findIndex(h => 
      h && h.toString().toLowerCase().includes('name')
    );
    const cgpaIndex = headers.findIndex(h => 
      h && h.toString().toLowerCase().includes('cgpa')
    );
    const creditIndex = headers.findIndex(h => 
      h && h.toString().toLowerCase().includes('credit')
    );
    
    // Extract course columns
    const courseColumns = headers
      .map((header, index) => ({ header, index }))
      .filter(({ header }) => 
        header && (
          header.toString().includes('CAS') || 
          header.toString().includes('EDU') ||
          header.toString().includes('EDC') ||
          header.toString().includes('EDUL')
        )
      );
    
    // Process students
    const students = dataRows
      .filter(row => row && row.length > 0 && row[idIndex])
      .map(row => {
        const student = {
          id: row[idIndex]?.toString().trim() || '',
          name: row[nameIndex]?.toString().trim() || '',
          cgpa: parseFloat(row[cgpaIndex]) || 0,
          credits: parseInt(row[creditIndex]) || 0,
          courseStatus: {},
          grades: {},
          program: 'Master of Education in Educational Leadership',
          isActive: true
        };
        
        // Process course data for this student
        courseColumns.forEach(({ header, index }) => {
          const value = row[index];
          if (value && value.toString().trim()) {
            const courseCode = this.extractCourseCode(header.toString());
            if (courseCode) {
              const grade = value.toString().trim();
              if (grade === 'Pending') {
                student.courseStatus[courseCode] = 'IP'; // In Progress
              } else if (grade && grade !== '') {
                student.courseStatus[courseCode] = 'A'; // Completed
                student.grades[courseCode] = grade;
              }
            }
          }
        });
        
        return student;
      })
      .filter(student => student.id && student.name);
    
    // Extract unique courses
    const courses = courseColumns.map(({ header }) => {
      const courseCode = this.extractCourseCode(header.toString());
      return {
        code: courseCode,
        title: header.toString().replace('CAS ', '').trim(),
        credits: 3, // Default credits
        prerequisites: []
      };
    }).filter(course => course.code);
    
    return { students, courses };
  }

  extractCourseCode(header) {
    // Extract course code from header like "CAS EDC471(E)" -> "EDC 471(E)"
    const match = header.match(/CAS\s+([A-Z]+\s*\d+[A-Z]*\([A-Z]\)?)/);
    if (match) {
      return match[1].replace(/([A-Z]+)(\d+)/, '$1 $2');
    }
    return null;
  }

  // Get all students
  getAllStudents() {
    return this.students;
  }

  // Get student by ID
  getStudentById(id) {
    return this.students.find(student => student.id === id);
  }

  // Authenticate student
  authenticateStudent(studentId, password) {
    const student = this.getStudentById(studentId);
    if (student && student.password === password && student.isActive) {
      return student;
    }
    return null;
  }

  // Set current student
  setCurrentStudent(student) {
    this.currentStudent = student;
    this.saveToStorage();
  }

  // Get current student
  getCurrentStudent() {
    return this.currentStudent;
  }

  // Update student data
  updateStudent(studentId, updates) {
    const studentIndex = this.students.findIndex(s => s.id === studentId);
    if (studentIndex >= 0) {
      this.students[studentIndex] = {
        ...this.students[studentIndex],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      // Update current student if it's the same
      if (this.currentStudent && this.currentStudent.id === studentId) {
        this.currentStudent = this.students[studentIndex];
      }
      
      this.saveToStorage();
      return this.students[studentIndex];
    }
    return null;
  }

  // Update student course status
  updateStudentCourseStatus(studentId, courseCode, status) {
    const student = this.getStudentById(studentId);
    if (student) {
      const updatedStudent = {
        ...student,
        courseStatus: {
          ...student.courseStatus,
          [courseCode]: status
        },
        lastUpdated: new Date().toISOString()
      };
      return this.updateStudent(studentId, updatedStudent);
    }
    return null;
  }

  // Update student grade
  updateStudentGrade(studentId, courseCode, grade) {
    const student = this.getStudentById(studentId);
    if (student) {
      const updatedStudent = {
        ...student,
        grades: {
          ...student.grades,
          [courseCode]: grade
        },
        lastUpdated: new Date().toISOString()
      };
      return this.updateStudent(studentId, updatedStudent);
    }
    return null;
  }

  // Logout current student
  logout() {
    this.currentStudent = null;
    this.saveToStorage();
  }

  // Get available courses
  getAvailableCourses() {
    return this.availableCourses || [];
  }

  // Clear all data
  clearAllData() {
    this.students = [];
    this.currentStudent = null;
    this.availableCourses = [];
    localStorage.removeItem('medelAllStudents');
  }

  // Force reload fresh data from database
  reloadFreshData() {
    localStorage.removeItem('medelAllStudents');
    this.students = studentDatabase; // Reload from fresh database
    this.currentStudent = null;
    console.log('Reloaded fresh data from database');
  }
}

// Create singleton instance
const studentDataService = new StudentDataService();

export default studentDataService;
