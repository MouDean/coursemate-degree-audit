import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateStudentPDF = async (studentData, studyPlan) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add text with word wrapping
  const addText = (text, x, y, maxWidth, fontSize = 10, fontStyle = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Helper function to add a line
  const addLine = (x1, y1, x2, y2) => {
    doc.line(x1, y1, x2, y2);
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Helper function to create a table
  const createTable = (headers, data, startY) => {
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: startY,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Course Code
        1: { cellWidth: 60 }, // Course Title
        2: { cellWidth: 15 }, // Credits
        3: { cellWidth: 25 }, // Status
        4: { cellWidth: 20 }, // Grade
        5: { cellWidth: 35 }  // Prerequisites
      },
      margin: { left: 20, right: 20 }
    });
    return doc.lastAutoTable.finalY + 10;
  };

  // Header with Logo
  doc.setFillColor(41, 128, 185); // Blue color
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Load and add logo image
  try {
    // Convert image to base64 and add to PDF
    const response = await fetch('/1.png');
    const blob = await response.blob();
    const reader = new FileReader();
    
    await new Promise((resolve, reject) => {
      reader.onload = () => {
        try {
                     doc.addImage(reader.result, 'PNG', 20, 5, 32, 32);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
         // Fallback: Create a simple logo placeholder
     doc.setFillColor(255, 255, 255);
     doc.rect(20, 5, 32, 32, 'F');
     doc.setTextColor(0, 0, 0);
     doc.setFontSize(10);
     doc.text('LOGO', 32, 22);
  }
  
  // Title and subtitle
  doc.setTextColor(255, 255, 255);
  yPosition = addText('CourseMate', 60, 20, pageWidth - 80, 18, 'bold');
  yPosition = addText('Abu Dhabi University - Academic Report', 60, yPosition + 5, pageWidth - 80, 12, 'normal');
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPosition = 60;

  // Student Information Section
  yPosition = addText('STUDENT INFORMATION', 20, yPosition, pageWidth - 40, 14, 'bold');
  yPosition += 10;
  
  addLine(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  const studentInfo = [
    `Student Name: ${studentData.name}`,
    `Student ID: ${studentData.id}`,
    `Program: ${studentData.program || 'Master of Education in Educational Leadership'}`,
    `CGPA: ${studentData.cgpa ? studentData.cgpa.toFixed(3) : '0.000'}`
  ];

  studentInfo.forEach(info => {
    yPosition = addText(info, 20, yPosition, pageWidth - 40, 10);
    yPosition += 5;
  });

  yPosition += 10;

  // Academic Progress Section
  checkNewPage(50);
  yPosition = addText('ACADEMIC PROGRESS', 20, yPosition, pageWidth - 40, 14, 'bold');
  yPosition += 10;
  
  addLine(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  // Calculate progress
  const allCourses = [
    ...(studyPlan.preCoreCourses || []),
    ...(studyPlan.coreCourses || []),
    ...(studyPlan.electives || [])
  ];

  let completed = 0;
  let inProgress = 0;
  let planned = 0;
  let completedCredits = 0;
  let totalCredits = studyPlan.totalCredits;

  allCourses.forEach(course => {
    const status = studentData.courseStatus[course.code] || '';
    switch (status) {
      case 'A':
        completed++;
        completedCredits += course.credits;
        break;
      case 'IP':
        inProgress++;
        break;
      case 'P':
        planned++;
        break;
    }
  });

  const progressPercentage = ((completedCredits / totalCredits) * 100).toFixed(1);

  const progressInfo = [
    `Completed Courses: ${completed} (${completedCredits} credits)`,
    `In Progress: ${inProgress} courses`,
    `Planned: ${planned} courses`,
    `Total Credits Required: ${totalCredits}`,
    `Progress: ${progressPercentage}%`
  ];

  progressInfo.forEach(info => {
    yPosition = addText(info, 20, yPosition, pageWidth - 40, 10);
    yPosition += 5;
  });

  yPosition += 10;

  // Course Details Section
  checkNewPage(100);
  yPosition = addText('COURSE DETAILS', 20, yPosition, pageWidth - 40, 14, 'bold');
  yPosition += 10;
  
  addLine(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  // Table headers
  const tableHeaders = ['Course Code', 'Course Title', 'Credits', 'Status', 'Grade', 'Prerequisites'];

  // Core Courses Table
  if (studyPlan.coreCourses && studyPlan.coreCourses.length > 0) {
    yPosition = addText('Core Courses', 20, yPosition, pageWidth - 40, 12, 'bold');
    yPosition += 5;

    const coreCoursesData = studyPlan.coreCourses.map(course => {
      const status = studentData.courseStatus[course.code] || '';
      const grade = studentData.grades[course.code] || '';
      const statusText = getStatusText(status);
      const prerequisites = course.prerequisites && course.prerequisites.length > 0 
        ? course.prerequisites.join(', ') 
        : '';

      return [
        course.code,
        course.title,
        course.credits.toString(),
        statusText,
        status === 'A' ? (grade || '-') : '-',
        prerequisites
      ];
    });

    yPosition = createTable(tableHeaders, coreCoursesData, yPosition);
  }

  // Elective Courses Table
  if (studyPlan.electives && studyPlan.electives.length > 0) {
    yPosition = addText('Elective Courses', 20, yPosition, pageWidth - 40, 12, 'bold');
    yPosition += 5;

    const electiveCoursesData = studyPlan.electives.map(course => {
      const status = studentData.courseStatus[course.code] || '';
      const grade = studentData.grades[course.code] || '';
      const statusText = getStatusText(status);
      const prerequisites = course.prerequisites && course.prerequisites.length > 0 
        ? course.prerequisites.join(', ') 
        : '';

      return [
        course.code,
        course.title,
        course.credits.toString(),
        statusText,
        status === 'A' ? (grade || '-') : '-',
        prerequisites
      ];
    });

    yPosition = createTable(tableHeaders, electiveCoursesData, yPosition);
  }

  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);
  }

  return doc;
};

// Helper function to get status text
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

// Export function to download PDF
export const downloadStudentPDF = async (studentData, studyPlan) => {
  try {
    const doc = await generateStudentPDF(studentData, studyPlan);
    const fileName = `${studentData.name}_Study_Plan_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback: generate PDF without logo
    const doc = generateStudentPDFFallback(studentData, studyPlan);
    const fileName = `${studentData.name}_Study_Plan_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }
};

// Fallback function without logo
const generateStudentPDFFallback = (studentData, studyPlan) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add text with word wrapping
  const addText = (text, x, y, maxWidth, fontSize = 10, fontStyle = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Simple header without logo
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  yPosition = addText('CourseMate', 20, 15, pageWidth - 40, 16, 'bold');
  yPosition = addText('Abu Dhabi University - Academic Report', 20, yPosition + 5, pageWidth - 40, 12, 'normal');
  
  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // Add basic content (simplified version)
  yPosition = addText('STUDENT INFORMATION', 20, yPosition, pageWidth - 40, 14, 'bold');
  yPosition += 10;
  
  const studentInfo = [
    `Student Name: ${studentData.name}`,
    `Student ID: ${studentData.id}`,
    `Program: ${studentData.program || 'Master of Education in Educational Leadership'}`,
    `CGPA: ${studentData.cgpa ? studentData.cgpa.toFixed(3) : '0.000'}`
  ];

  studentInfo.forEach(info => {
    yPosition = addText(info, 20, yPosition, pageWidth - 40, 10);
    yPosition += 5;
  });

  return doc;
};
