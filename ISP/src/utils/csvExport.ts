/**
 * Export data to CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the CSV file
 * @param columns - Column definitions (key and label)
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns: { key: keyof T; label: string }[]
): void {
  // Create CSV header
  const headers = columns.map((col) => col.label).join(',');
  
  // Create CSV rows
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        const value = item[col.key];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value || '').replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('"') ? `"${escaped}"` : escaped;
      })
      .join(',');
  });
  
  // Combine header and rows
  const csv = [headers, ...rows].join('\n');
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export table to CSV (helper for common use case)
 */
export function exportTableToCSV(
  data: any[],
  filename: string
): void {
  if (!data || data.length === 0) {
    return;
  }
  
  // Get columns from first object
  const columns = Object.keys(data[0]).map((key) => ({
    key,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
  }));
  
  exportToCSV(data, filename, columns);
}
