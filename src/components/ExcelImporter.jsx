import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const ExcelImporter = ({ onDataImported }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

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
        
        // Process the data
        const processedData = processExcelData(jsonData);
        
        if (processedData && processedData.length > 0) {
          setMessage(`Successfully imported ${processedData.length} courses!`);
          setMessageType('success');
          onDataImported(processedData);
        } else {
          setMessage('No valid course data found in the Excel file.');
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

  const processExcelData = (jsonData) => {
    if (!jsonData || jsonData.length < 2) return [];
    
    // Assume first row is headers
    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);
    
    // Find column indices
    const codeIndex = headers.findIndex(h => 
      h && h.toString().toLowerCase().includes('code')
    );
    const titleIndex = headers.findIndex(h => 
      h && h.toString().toLowerCase().includes('title')
    );
    const creditsIndex = headers.findIndex(h => 
      h && h.toString().toLowerCase().includes('credit')
    );
    const prerequisitesIndex = headers.findIndex(h => 
      h && h.toString().toLowerCase().includes('prerequisite')
    );
    
    const courses = dataRows
      .filter(row => row && row.length > 0 && row[codeIndex])
      .map(row => ({
        code: row[codeIndex]?.toString().trim() || '',
        title: row[titleIndex]?.toString().trim() || '',
        credits: parseInt(row[creditsIndex]) || 3,
        prerequisites: row[prerequisitesIndex] ? 
          row[prerequisitesIndex].toString().split(',').map(p => p.trim()).filter(p => p) : []
      }))
      .filter(course => course.code && course.title);
    
    return courses;
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
        <FileSpreadsheet className="h-5 w-5 mr-2 text-green-600" />
        Import Course Data from Excel
      </h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Upload an Excel file with course data. Expected columns:
        </p>
        <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
          <li><strong>Code:</strong> Course code (e.g., EDU 501)</li>
          <li><strong>Title:</strong> Course title</li>
          <li><strong>Credits:</strong> Number of credits (default: 3)</li>
          <li><strong>Prerequisites:</strong> Comma-separated prerequisite codes (optional)</li>
        </ul>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
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
          Drop your Excel file here
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse
        </p>
        
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          className="hidden"
          id="excel-upload"
        />
        <label
          htmlFor="excel-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer text-sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Excel File
        </label>
      </div>

      {isProcessing && (
        <div className="mt-4 flex items-center text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          Processing Excel file...
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
    </div>
  );
};

export default ExcelImporter;
