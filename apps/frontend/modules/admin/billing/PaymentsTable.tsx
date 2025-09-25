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
  FileText, 
  Loader2,
  DollarSign,
  CreditCard
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/ui/dropdown-menu';
import type { PaymentWithRelationsDto, PaymentStatus, PaymentMethod } from '@/lib/dtos/order';
import { PaymentDialog } from '@/modules/admin/billing/PaymentDialog';

interface PaymentsTableProps {
  payments: PaymentWithRelationsDto[];
  isLoading: boolean;
  searchTerm: string;
  onRowClick?: (payment: PaymentWithRelationsDto) => void;
}

const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getMethodColor = (method: PaymentMethod) => {
  switch (method) {
    case 'card':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cash':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'bank_transfer':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'digital_wallet':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'check':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'credit':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatMethodName = (method: PaymentMethod) => {
  switch (method) {
    case 'bank_transfer':
      return 'Bank Transfer';
    case 'digital_wallet':
      return 'Digital Wallet';
    default:
      return method.charAt(0).toUpperCase() + method.slice(1);
  }
};

export function PaymentsTable({ payments, isLoading, searchTerm, onRowClick }: PaymentsTableProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithRelationsDto | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment => 
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.amount.toString().includes(searchTerm)
  );

  const handleViewPayment = (payment: PaymentWithRelationsDto) => {
    setSelectedPayment(payment);
    setIsViewDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading payments...</span>
      </div>
    );
  }

  if (filteredPayments.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No payments found</h3>
        <p className="text-gray-500">
          {searchTerm ? 'Try adjusting your search terms.' : 'Record payments for invoices to get started.'}
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
              <TableHead>Payment ID</TableHead>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow 
                key={payment.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onRowClick?.(payment)}
              >
                <TableCell className="font-medium">
                  {payment.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {payment.invoiceId.slice(0, 8)}...
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    <span className="font-medium">Rs {parseFloat(payment.amount).toFixed(2)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getMethodColor(payment.method)}
                  >
                    {formatMethodName(payment.method)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(payment.status)}
                  >
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(payment.paidAt), 'MMM dd, yyyy HH:mm')}
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
                      <DropdownMenuItem onClick={() => handleViewPayment(payment)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Payment Dialog */}
      <PaymentDialog 
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        payment={selectedPayment}
        invoices={[]} // Will be passed from parent via props if needed
        onClose={() => {
          setSelectedPayment(null);
          setIsViewDialogOpen(false);
        }}
      />
    </>
  );
}