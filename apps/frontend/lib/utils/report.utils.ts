import { Product } from '../dtos/product';
import { Contract } from '../services/dtos/contract';
import jsPDF from 'jspdf';

export interface ReportColumn {
  key: string;
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

export const contractReportColumns: ReportColumn[] = [
  { key: 'title', header: 'Contract Title' },
  { key: 'description', header: 'Description' },
  { 
    key: 'amount', 
    header: 'Amount (Rs.)',
    formatter: (value: string) => {
      const numAmount = parseFloat(value);
      return numAmount.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
  },
  { 
    key: 'startDate', 
    header: 'Start Date',
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
    key: 'endDate', 
    header: 'End Date',
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
    key: 'createdAt', 
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
  { key: 'ownerId', header: 'Owner ID' }
];

export const generateContractReport = (contracts: Contract[]): string => {
  return generateCSV(contracts, contractReportColumns);
};

export const downloadContractReport = (contracts: Contract[]): void => {
  const csvContent = generateContractReport(contracts);
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const filename = `contracts-report-${timestamp}.csv`;
  downloadCSV(csvContent, filename);
};

// PDF Generation Functions
export const generateContractPDF = (contracts: Contract[]): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Contract Management Report', 14, 22);
  
  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 14, 30);
  
  // Add summary
  doc.setFontSize(12);
  doc.text(`Total Contracts: ${contracts.length}`, 14, 40);
  
  // Add table headers
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  let yPosition = 60;
  
  // Headers
  doc.text('Title', 14, yPosition);
  doc.text('Amount (Rs.)', 80, yPosition);
  doc.text('Start Date', 120, yPosition);
  doc.text('End Date', 150, yPosition);
  doc.text('Created Date', 180, yPosition);
  
  yPosition += 10;
  
  // Add a line under headers
  doc.line(14, yPosition - 5, 200, yPosition - 5);
  
  // Add contract data
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  contracts.forEach((contract, index) => {
    // Check if we need a new page
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Contract data
    doc.text(contract.title.length > 30 ? contract.title.substring(0, 30) + '...' : contract.title, 14, yPosition);
    doc.text(formatCurrency(contract.amount), 80, yPosition);
    doc.text(formatDate(contract.startDate), 120, yPosition);
    doc.text(formatDate(contract.endDate), 150, yPosition);
    doc.text(formatDate(contract.createdAt), 180, yPosition);
    
    yPosition += 8;
    
    // Add separator line every 5 rows
    if ((index + 1) % 5 === 0) {
      doc.line(14, yPosition - 2, 200, yPosition - 2);
      yPosition += 3;
    }
  });
  
  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
  }
  
  // Download the PDF
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `contracts-report-${timestamp}.pdf`;
  doc.save(filename);
};

// PDF Generation Functions for Products
export const generateProductPDF = (products: Product[]): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Product Management Report', 14, 22);
  
  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 14, 30);
  
  // Add summary
  doc.setFontSize(12);
  doc.text(`Total Products: ${products.length}`, 14, 40);
  
  // Add table headers
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  let yPosition = 60;
  
  // Headers
  doc.text('Product Name', 14, yPosition);
  doc.text('Size', 60, yPosition);
  doc.text('Color', 80, yPosition);
  doc.text('Quantity', 100, yPosition);
  doc.text('Price (Rs.)', 120, yPosition);
  doc.text('Stock Status', 150, yPosition);
  doc.text('Created Date', 180, yPosition);
  
  yPosition += 10;
  
  // Add a line under headers
  doc.line(14, yPosition - 5, 200, yPosition - 5);
  
  // Add product data
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  
  products.forEach((product, index) => {
    // Check if we need a new page
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Product data
    doc.text(product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name, 14, yPosition);
    doc.text(product.size || 'N/A', 60, yPosition);
    doc.text(product.color || 'N/A', 80, yPosition);
    doc.text(product.qty.toString(), 100, yPosition);
    doc.text(formatCurrency(product.price), 120, yPosition);
    doc.text(product.qty > 0 ? 'In Stock' : 'Out of Stock', 150, yPosition);
    doc.text(formatDate(product.created_at), 180, yPosition);
    
    yPosition += 8;
    
    // Add separator line every 5 rows
    if ((index + 1) % 5 === 0) {
      doc.line(14, yPosition - 2, 200, yPosition - 2);
      yPosition += 3;
    }
  });
  
  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
  }
  
  // Download the PDF
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `products-report-${timestamp}.pdf`;
  doc.save(filename);
};

// Helper functions for formatting
const formatCurrency = (amount: string): string => {
  const numAmount = parseFloat(amount);
  return numAmount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};

const formatDate = (date: string | Date): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
