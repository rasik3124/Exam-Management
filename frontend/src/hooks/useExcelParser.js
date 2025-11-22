// src/hooks/useExcelParser.js
import { useState } from 'react';
import * as XLSX from 'xlsx';

export const useExcelParser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseExcelFile = async (file) => {
    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Validate and transform data
          const students = jsonData.map((row, index) => ({
            id: index + 1,
            reg_no: row.reg_no?.toString() || `STU${index + 1}`,
            name: row.name?.toString() || 'Unknown Student',
            dept: row.dept?.toString() || 'UNKNOWN',
            sem: parseInt(row.sem) || 1,
            subject: row.subject?.toString() || 'General',
            // REMOVED: bench_id field
            // Add default values for missing fields
            ...row
          }));

          resolve(students);
        } catch (err) {
          setError('Failed to parse Excel file: ' + err.message);
          reject(err);
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setLoading(false);
        reject(new Error('File reading failed'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return { parseExcelFile, loading, error };
};