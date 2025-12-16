// engines/excelParser.js
import * as XLSX from 'xlsx';

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        if (jsonData.length < 2) {
          reject(new Error('File appears to be empty'));
          return;
        }
        
        const headers = jsonData[0];
        const rows = jsonData.slice(1).filter(row => row.some(cell => cell != null));
        
        resolve({ headers, rows });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const detectColumnTypes = (headers, sampleRows) => {
  const columnAnalysis = headers.map((header, index) => {
    const sampleValues = sampleRows.slice(0, 10).map(row => row[index]).filter(Boolean);
    
    // Analyze content patterns
    const isRegistration = sampleValues.some(val => 
      /^[A-Z0-9]{6,12}$/i.test(String(val).trim())
    );
    
    const isSemester = sampleValues.some(val => 
      /^[1-8]$/.test(String(val).trim())
    );
    
    const isDepartment = sampleValues.some(val => 
      /^(CSE|ECE|ME|CE|EEE|IT|CS|EC|ME|CE|EE)$/i.test(String(val).trim())
    );
    
    const isSubjectCode = sampleValues.some(val => 
      /^[A-Z]{2,3}\s?[0-9]{3}$/i.test(String(val).trim())
    );
    
    const isName = sampleValues.some(val => 
      /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(String(val).trim())
    );
    
    return {
      header,
      index,
      isRegistration,
      isSemester,
      isDepartment,
      isSubjectCode,
      isName,
      sampleValues
    };
  });
  
  return columnAnalysis;
};