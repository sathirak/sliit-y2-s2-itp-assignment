'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Loader2 } from 'lucide-react';
import { useInvoiceMutations } from '@/lib/hooks/useInvoices';
import type { InvoiceWithRelationsDto, InvoiceStatus, OrderDto } from '@/lib/dtos/order';

const invoiceFormSchema = z.object({
  orderId: z.string().uuid({ message: 'Valid order ID is required' }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number with up to 2 decimal places'),
  status: z.enum(['unpaid', 'paid', 'overdue', 'cancelled', 'partial']),
  dueDate: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: InvoiceWithRelationsDto | null;
  orders: OrderDto[];
  onClose?: () => void;
}

export function InvoiceDialog({ open, onOpenChange, invoice, orders, onClose }: InvoiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createInvoice } = useInvoiceMutations();

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      orderId: '',
      amount: '',
      status: 'unpaid',
      dueDate: '',
    },
  });

  // Reset form when dialog opens/closes or when invoice changes
  useEffect(() => {
    if (open && invoice) {
      // Editing existing invoice - we only allow editing for status updates
      // This dialog is primarily for creating new invoices
      form.reset({
        orderId: invoice.orderId,
        amount: invoice.amount,
        status: invoice.status,
        dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
      });
    } else if (open && !invoice) {
      // Creating new invoice
      form.reset({
        orderId: '',
        amount: '',
        status: 'unpaid',
        dueDate: '',
      });
    }
  }, [open, invoice, form]);

  const onSubmit = async (data: InvoiceFormValues) => {
    if (invoice) {
      // This dialog is for creating new invoices, editing should be done via status dialog
      return;
    }

    setIsSubmitting(true);
    try {
      await createInvoice({
        orderId: data.orderId,
        amount: data.amount,
        status: data.status as InvoiceStatus,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      });
      
      handleClose();
    } catch (error) {
      console.error('Failed to create invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'View Invoice' : 'Create New Invoice'}
          </DialogTitle>
          <DialogDescription>
            {invoice 
              ? 'Invoice details are shown below. Use the status dialog to update the invoice status.' 
              : 'Create a new invoice by filling out the form below.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!!invoice}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          Order {order.id.slice(0, 8)}... - {order.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0.00" 
                      {...field} 
                      disabled={!!invoice}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!!invoice}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select invoice status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      disabled={!!invoice}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                {invoice ? 'Close' : 'Cancel'}
              </Button>
              {!invoice && (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Invoice'
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}