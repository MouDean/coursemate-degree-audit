import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Users, Database } from 'lucide-react';
import * as XLSX from 'xlsx';

const AdminExcelImporter = ({ onStudentsImported }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [importedCount, setImportedCount] = useState(0);

  const handleFile = (file) => {
    if (!file) return;

    setIsProcessing(true);
    setMessage('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Process the transcript data
        const { students, courses } = processTranscriptData(jsonData);
        
        if (students && students.length > 0) {
          setImportedCount(students.length);
          setMessage(`Successfully imported ${students.length} students and ${courses.length} courses!`);
          setMessageType('success');
          onStudentsImported(students, courses);
        } else {
          setMessage('No valid student data found in the Excel file.');
          setMessageType('error');
        }
      } catch (error) {
        console.error('Error processing Excel file:', error);
        setMessage('Error processing Excel file. Please check the format.');
        setMessageType('error');
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const processTranscriptData = (jsonData) => {
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
            const courseCode = extractCourseCode(header.toString());
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
      const courseCode = extractCourseCode(header.toString());
      return {
        code: courseCode,
        title: header.toString().replace('CAS ', '').trim(),
        credits: 3, // Default credits
        prerequisites: []
      };
    }).filter(course => course.code);
    
    return { students, courses };
  };

  const extractCourseCode = (header) => {
    // Extract course code from header like "CAS EDC471(E)" -> "EDC 471(E)"
    const match = header.match(/CAS\s+([A-Z]+\s*\d+[A-Z]*\([A-Z]\)?)/);
    if (match) {
      return match[1].replace(/([A-Z]+)(\d+)/, '$1 $2');
    }
    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );
    
    if (excelFile) {
      handleFile(excelFile);
    } else {
      setMessage('Please upload an Excel file (.xlsx or .xls)');
      setMessageType('error');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Database className="h-5 w-5 mr-2 text-green-600" />
        Admin: Import All Student Data
      </h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Upload the complete Excel file with all student transcript data. This will:
        </p>
        <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
          <li>Import all students and their course data</li>
          <li>Enable individual student login access</li>
          <li>Create personalized study plans for each student</li>
          <li>Update existing student data if already imported</li>
        </ul>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-green-400 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop your complete Excel transcript file here
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse
        </p>
        
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          className="hidden"
          id="admin-excel-upload"
        />
        <label
          htmlFor="admin-excel-upload"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer text-sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Excel File
        </label>
      </div>

      {isProcessing && (
        <div className="mt-4 flex items-center text-green-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
          Processing student data...
        </div>
      )}

      {message && (
        <div className={`mt-4 flex items-center ${
          messageType === 'success' ? 'text-green-600' : 'text-red-600'
        }`}>
          {messageType === 'success' ? (
            <CheckCircle className="h-4 w-4 mr-2" />
          ) : (
            <AlertCircle className="h-4 w-4 mr-2" />
          )}
          {message}
        </div>
      )}

      {importedCount > 0 && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <Users className="h-5 w-5 mr-2" />
            <span className="font-medium">Ready for Student Login!</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            {importedCount} students can now log in using their student ID as password.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminExcelImporter;
