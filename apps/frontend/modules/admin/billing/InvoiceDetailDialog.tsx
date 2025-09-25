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

import { FileText, CalendarDays, Package, CreditCard, DollarSign } from 'lucide-react';
import type { InvoiceWithRelationsDto, InvoiceStatus } from '@/lib/dtos/order';

interface InvoiceDetailDialogProps {
  invoice: InvoiceWithRelationsDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: InvoiceStatus) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'unpaid':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'overdue':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'partial':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function InvoiceDetailDialog({ invoice, open, onOpenChange }: InvoiceDetailDialogProps) {
  if (!invoice) return null;

  const totalPaid = invoice.payments?.reduce((sum, payment) => 
    sum + parseFloat(payment.amount), 0
  ) || 0;
  
  const remainingAmount = parseFloat(invoice.amount) - totalPaid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Details
          </DialogTitle>
          <DialogDescription>
            Detailed information for invoice #{invoice.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Invoice ID</p>
                    <p className="text-sm text-muted-foreground">{invoice.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Order ID</p>
                    <p className="text-sm text-muted-foreground">{invoice.orderId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Issued Date</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(invoice.issuedAt), 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Due Date</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.dueDate ? format(new Date(invoice.dueDate), 'PPP') : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-4" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Invoice Amount</span>
                  <span className="font-semibold">${parseFloat(invoice.amount).toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Amount Paid</span>
                  <span className="font-semibold text-green-600">${totalPaid.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Remaining</span>
                  <span className={`font-semibold ${remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${remainingAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Order */}
          {invoice.order && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{invoice.order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Created: {format(new Date(invoice.order.createdAt), 'PPP')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Customer: {invoice.order.customerId || 'Guest'}
                      </p>
                    </div>
                    <Badge className={
                      invoice.order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      invoice.order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      invoice.order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {invoice.order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payments */}
          {invoice.payments && invoice.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoice.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Payment #{payment.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(payment.paidAt), 'PPP')}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          Method: {payment.method.replace('_', ' ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${parseFloat(payment.amount).toFixed(2)}</p>
                        <Badge className={
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}