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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/ui/select';
import { Loader2 } from 'lucide-react';
import { useInvoiceMutations } from '@/lib/hooks/useInvoices';
import type { InvoiceWithRelationsDto, InvoiceStatus } from '@/lib/dtos/order';

const statusFormSchema = z.object({
  status: z.enum(['unpaid', 'paid', 'overdue', 'cancelled', 'partial']),
});

type StatusFormValues = z.infer<typeof statusFormSchema>;

interface InvoiceStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: InvoiceWithRelationsDto | null;
  onClose?: () => void;
}

export function InvoiceStatusDialog({ open, onOpenChange, invoice, onClose }: InvoiceStatusDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateInvoiceStatus } = useInvoiceMutations();

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      status: 'unpaid',
    },
  });

  // Reset form when dialog opens/closes or when invoice changes
  useEffect(() => {
    if (open && invoice) {
      form.reset({
        status: invoice.status,
      });
    }
  }, [open, invoice, form]);

  const onSubmit = async (data: StatusFormValues) => {
    if (!invoice) return;

    setIsSubmitting(true);
    try {
      await updateInvoiceStatus(invoice.id, data.status as InvoiceStatus);
      handleClose();
    } catch (error) {
      console.error('Failed to update invoice status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
    onClose?.();
  };

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Invoice Status</DialogTitle>
          <DialogDescription>
            Update the status of invoice {invoice.id.slice(0, 8)}... for Rs {parseFloat(invoice.amount).toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <p><strong>Invoice ID:</strong> {invoice.id}</p>
                <p><strong>Order ID:</strong> {invoice.orderId}</p>
                <p><strong>Amount:</strong> Rs {parseFloat(invoice.amount).toFixed(2)}</p>
                <p><strong>Current Status:</strong> {invoice.status}</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}