'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/ui/table';
import { Badge } from '@/modules/ui/badge';
import { Button } from '@/modules/ui/button';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  FileText, 
  Loader2,
  Calendar,
  DollarSign
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/ui/dropdown-menu';
import type { InvoiceWithRelationsDto, InvoiceStatus, OrderDto } from '@/lib/dtos/order';
import { InvoiceStatusDialog } from '@/modules/admin/billing/InvoiceStatusDialog';
import { InvoiceDialog } from '@/modules/admin/billing/InvoiceDialog';

interface InvoicesTableProps {
  invoices: InvoiceWithRelationsDto[];
  isLoading: boolean;
  searchTerm: string;
}

const getStatusColor = (status: InvoiceStatus) => {
  switch (status) {
    case 'unpaid':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'overdue':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'partial':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function InvoicesTable({ invoices, isLoading, searchTerm }: InvoicesTableProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithRelationsDto | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.amount.toString().includes(searchTerm)
  );

  const handleEditInvoice = (invoice: InvoiceWithRelationsDto) => {
    setSelectedInvoice(invoice);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStatus = (invoice: InvoiceWithRelationsDto) => {
    setSelectedInvoice(invoice);
    setIsStatusDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading invoices...</span>
      </div>
    );
  }

  if (filteredInvoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No invoices found</h3>
        <p className="text-gray-500">
          {searchTerm ? 'Try adjusting your search terms.' : 'Create invoices for orders to get started.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issued Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  {invoice.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {invoice.orderId.slice(0, 8)}...
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    <span className="font-medium">${parseFloat(invoice.amount).toFixed(2)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(invoice.status)}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {format(new Date(invoice.issuedAt), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  {invoice.dueDate ? (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                    </div>
                  ) : (
                    <span className="text-gray-400">No due date</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(invoice)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Update Status
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Invoice Dialog - Note: This is for viewing only */}
      <InvoiceDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        invoice={selectedInvoice}
        orders={[]} // Will be passed from parent
        onClose={() => {
          setSelectedInvoice(null);
          setIsEditDialogOpen(false);
        }}
      />

      {/* Status Update Dialog */}
      <InvoiceStatusDialog 
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        invoice={selectedInvoice}
        onClose={() => {
          setSelectedInvoice(null);
          setIsStatusDialogOpen(false);
        }}
      />
    </>
  );
}