import React, { useRef } from 'react';
import { Button } from '@mui/material';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useImportCustomers } from '@/hooks/useCustomers';
import toast from 'react-hot-toast';

export default function ImportCustomers() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMutation = useImportCustomers();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) {
          toast.error('The Excel file is empty');
          return;
        }

        // Map Excel columns to CustomerFormData
        // Expected headers: Name, Email, Phone, Address, City, State, Zip, Package
        const customersToImport = json.map((row: any) => ({
          fullName: row.Name || row['Full Name'] || row.fullName,
          email: row.Email || row.email,
          phone: String(row.Phone || row.phone || ''),
          address: row.Address || row.address || '',
          city: row.City || row.city || '',
          state: row.State || row.state || '',
          zipCode: String(row.Zip || row.zipCode || row['ZIP Code'] || ''),
          packageId: row.PackageId || row.packageId || '',
          packageName: row.Package || row.packageName || '',
          connectionDate: new Date().toISOString().split('T')[0],
        }));

        await importMutation.mutateAsync(customersToImport);
        
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        console.error('Error importing Excel:', error);
        toast.error('Failed to parse Excel file. Please check the format.');
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx, .xls"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        variant="outlined"
        startIcon={<Upload size={20} />}
        onClick={handleButtonClick}
        disabled={importMutation.isPending}
        sx={{
          borderColor: '#FF9800',
          color: '#FF9800',
          '&:hover': {
            borderColor: '#F57C00',
            bgcolor: 'rgba(255, 152, 0, 0.04)',
          },
        }}
      >
        {importMutation.isPending ? 'Importing...' : 'Import Excel'}
      </Button>
    </>
  );
}
