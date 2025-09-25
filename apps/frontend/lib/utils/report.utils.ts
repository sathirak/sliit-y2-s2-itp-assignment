import { Product } from '../dtos/product';

export interface ReportColumn {
  key: keyof Product | string;
  header: string;
  formatter?: (value: any) => string;
}

export const generateCSV = <T extends Record<string, any>>(
  data: T[],
  columns: ReportColumn[]
): string => {
  if (data.length === 0) {
    return columns.map(col => col.header).join(',');
  }

  // Create header row
  const headers = columns.map(col => `"${col.header}"`).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key];
      
      // Apply formatter if provided
      if (col.formatter && value !== undefined && value !== null) {
        value = col.formatter(value);
      }
      
      // Handle null/undefined values
      if (value === null || value === undefined) {
        value = '';
      }
      
      // Convert to string and escape quotes
      const stringValue = String(value).replace(/"/g, '""');
      
      return `"${stringValue}"`;
    }).join(',');
  });
  
  return [headers, ...rows].join('\n');
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const productReportColumns: ReportColumn[] = [
  { key: 'name', header: 'Product Name' },
  { key: 'category', header: 'Category' },
  { key: 'description', header: 'Description' },
  { key: 'size', header: 'Size' },
  { key: 'color', header: 'Color' },
  { 
    key: 'qty', 
    header: 'Quantity',
    formatter: (value: number) => value.toString()
  },
  { 
    key: 'price', 
    header: 'Price (Rs.)',
    formatter: (value: string) => {
      const numPrice = parseFloat(value);
      return numPrice.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
  },
  { 
    key: 'created_at', 
    header: 'Created Date',
    formatter: (value: string | Date) => {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  },
  { 
    key: 'qty', 
    header: 'Stock Status',
    formatter: (value: number) => value > 0 ? 'In Stock' : 'Out of Stock'
  },
  { key: 'product_image', header: 'Image URL' }
];

export const generateProductReport = (products: Product[]): string => {
  return generateCSV(products, productReportColumns);
};

export const downloadProductReport = (products: Product[]): void => {
  const csvContent = generateProductReport(products);
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const filename = `products-report-${timestamp}.csv`;
  downloadCSV(csvContent, filename);
};
