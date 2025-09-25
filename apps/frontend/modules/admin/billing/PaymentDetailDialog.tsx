'use client';

import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/modules/ui/dialog';
import { Badge } from '@/modules/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/ui/card';

import { CreditCard, CalendarDays, DollarSign, FileText, CheckCircle } from 'lucide-react';
import type { PaymentWithRelationsDto, PaymentStatus, PaymentMethod } from '@/lib/dtos/order';

interface PaymentDetailDialogProps {
  payment: PaymentWithRelationsDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'refunded':
      return 'bg-purple-100 text-purple-800 border-purple-200';
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

const formatPaymentMethod = (method: PaymentMethod) => {
  switch (method) {
    case 'bank_transfer':
      return 'Bank Transfer';
    case 'digital_wallet':
      return 'Digital Wallet';
    default:
      return method.charAt(0).toUpperCase() + method.slice(1);
  }
};

export function PaymentDetailDialog({ payment, open, onOpenChange }: PaymentDetailDialogProps) {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </DialogTitle>
          <DialogDescription>
            Detailed information for payment #{payment.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Payment ID</p>
                    <p className="text-sm text-muted-foreground">{payment.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Invoice ID</p>
                    <p className="text-sm text-muted-foreground">{payment.invoiceId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Payment Date</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(payment.paidAt), 'PPP p')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Amount</p>
                    <p className="text-lg font-semibold">${parseFloat(payment.amount).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-4" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Status</span>
                  <Badge className={getStatusColor(payment.status)}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Method</span>
                  <Badge className={getMethodColor(payment.method)}>
                    {formatPaymentMethod(payment.method)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Invoice */}
          {payment.invoice && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Invoice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Invoice #{payment.invoice.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Order ID: {payment.invoice.orderId}
                        </p>
                      </div>
                      <Badge className={
                        payment.invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.invoice.status === 'unpaid' ? 'bg-red-100 text-red-800' :
                        payment.invoice.status === 'overdue' ? 'bg-orange-100 text-orange-800' :
                        payment.invoice.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {payment.invoice.status}
                      </Badge>
                    </div>
                    
                    <div className="border-t border-gray-200 my-2" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Invoice Amount</p>
                        <p className="text-muted-foreground">${parseFloat(payment.invoice.amount).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Issued Date</p>
                        <p className="text-muted-foreground">
                          {format(new Date(payment.invoice.issuedAt), 'PP')}
                        </p>
                      </div>
                      {payment.invoice.dueDate && (
                        <>
                          <div>
                            <p className="font-medium">Due Date</p>
                            <p className="text-muted-foreground">
                              {format(new Date(payment.invoice.dueDate), 'PP')}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Payment Amount</span>
                  </div>
                  <span className="text-lg font-bold text-green-800">
                    ${parseFloat(payment.amount).toFixed(2)}
                  </span>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  This payment was processed on {format(new Date(payment.paidAt), 'PPPP')} at {format(new Date(payment.paidAt), 'p')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}