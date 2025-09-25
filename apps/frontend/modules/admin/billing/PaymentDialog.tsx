'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/modules/ui/dialog';
import { Button } from '@/modules/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/ui/select';
import { Badge } from '@/modules/ui/badge';
import { Loader2, FileText, DollarSign } from 'lucide-react';
import { usePaymentMutations } from '@/lib/hooks/usePayments';
import type { 
  PaymentWithRelationsDto, 
  PaymentStatus, 
  PaymentMethod, 
  InvoiceWithRelationsDto 
} from '@/lib/dtos/order';

const paymentFormSchema = z.object({
  invoiceId: z.string().uuid({ message: 'Valid invoice ID is required' }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number with up to 2 decimal places'),
  method: z.enum(['card', 'cash', 'bank_transfer', 'digital_wallet', 'check', 'credit']),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: PaymentWithRelationsDto | null;
  invoices: InvoiceWithRelationsDto[];
  onClose?: () => void;
}

export function PaymentDialog({ open, onOpenChange, payment, invoices, onClose }: PaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { makePayment } = usePaymentMutations();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      invoiceId: '',
      amount: '',
      method: 'card',
      status: 'completed',
    },
  });

  // Reset form when dialog opens/closes or when payment changes
  useEffect(() => {
    if (open && payment) {
      // Viewing existing payment
      form.reset({
        invoiceId: payment.invoiceId,
        amount: payment.amount,
        method: payment.method as PaymentFormValues['method'],
        status: payment.status as PaymentFormValues['status'],
      });
    } else if (open && !payment) {
      // Creating new payment
      form.reset({
        invoiceId: '',
        amount: '',
        method: 'card',
        status: 'completed',
      });
    }
  }, [open, payment, form]);

  const onSubmit = async (data: PaymentFormValues) => {
    if (payment) {
      // This dialog is for viewing payments, not editing them
      return;
    }

    setIsSubmitting(true);
    try {
      await makePayment({
        invoiceId: data.invoiceId,
        amount: data.amount,
        method: data.method as PaymentMethod,
        status: data.status as PaymentStatus,
      });
      
      handleClose();
    } catch (error) {
      console.error('Failed to record payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
    onClose?.();
  };

  const selectedInvoice = invoices.find(invoice => invoice.id === form.watch('invoiceId'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {payment ? 'Payment Details' : 'Record New Payment'}
          </DialogTitle>
          <DialogDescription>
            {payment 
              ? 'View payment information below.' 
              : 'Record a new payment by filling out the form below.'
            }
          </DialogDescription>
        </DialogHeader>

        {payment && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Payment ID:</p>
                <p className="font-medium">{payment.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Invoice ID:</p>
                <p className="font-medium">{payment.invoiceId}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount:</p>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                  <span className="font-medium">Rs {parseFloat(payment.amount).toFixed(2)}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600">Method:</p>
                <Badge variant="outline" className="mt-1">
                  {payment.method.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-gray-600">Status:</p>
                <Badge variant="outline" className="mt-1">
                  {payment.status.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-gray-600">Date:</p>
                <p className="font-medium">{format(new Date(payment.paidAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </div>
            {payment.invoice && (
              <div className="pt-2 border-t">
                <p className="text-gray-600 text-sm">Invoice Details:</p>
                <div className="mt-1 flex items-center justify-between">
                  <span>Invoice Amount: Rs {parseFloat(payment.invoice.amount).toFixed(2)}</span>
                  <Badge variant="outline">
                    {payment.invoice.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}

        {!payment && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="invoiceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an invoice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {invoices
                          .filter(invoice => invoice.status !== 'paid' && invoice.status !== 'cancelled')
                          .map((invoice) => (
                          <SelectItem key={invoice.id} value={invoice.id}>
                            Invoice {invoice.id.slice(0, 8)}... - Rs {parseFloat(invoice.amount).toFixed(2)} ({invoice.status})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedInvoice && (
                      <div className="text-sm text-gray-600 mt-1">
                        Amount: Rs {parseFloat(selectedInvoice.amount).toFixed(2)} | Status: {selectedInvoice.status}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount (Rs)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0.00" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          // Auto-fill with invoice amount if selected and amount is empty
                          if (!e.target.value && selectedInvoice) {
                            field.onChange(selectedInvoice.amount);
                          }
                        }}
                      />
                    </FormControl>
                    {selectedInvoice && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue('amount', selectedInvoice.amount)}
                        className="mt-1"
                      >
                        Use full invoice amount (Rs {parseFloat(selectedInvoice.amount).toFixed(2)})
                      </Button>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recording...
                    </>
                  ) : (
                    'Record Payment'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {payment && (
          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}