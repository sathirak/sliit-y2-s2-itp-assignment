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
import { Textarea } from '@/modules/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useOrderMutations } from '@/lib/hooks/useOrders';
import type { OrderDto, OrderStatus, OrderProductDto, CreateOrderProductItemDto } from '@/lib/dtos/order';
import { useProducts } from '@/lib/hooks/useProducts';
import { useOrderProductsByOrderId } from '@/lib/hooks/useOrderProducts';

const orderFormSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
  customerId: z.string().uuid().optional().or(z.literal('')),
  products: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1),
    price: z.string(),
  })).optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: OrderDto | null;
  onClose?: () => void;
}

export function OrderDialog({ open, onOpenChange, order, onClose }: OrderDialogProps) {
  const { products, isLoading: productsLoading } = useProducts();
  const { orderProducts: existingOrderProducts, isLoading: orderProductsLoading } = useOrderProductsByOrderId(order?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createOrder, updateOrder } = useOrderMutations();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      status: 'pending',
      customerId: '',
    },
  });

  // Reset form when dialog opens/closes or when order changes
  useEffect(() => {
    if (open && order && !orderProductsLoading) {
      // Editing existing order - populate with existing order products
      const productsData = existingOrderProducts.map(op => ({
        productId: op.productId,
        quantity: op.quantity,
        price: op.price,
      }));
      
      form.reset({
        status: order.status,
        customerId: order.customerId || '',
        products: productsData,
      });
    } else if (open && !order) {
      // Creating new order
      form.reset({
        status: 'pending',
        customerId: '',
        products: [],
      });
    }
  }, [open, order, form, existingOrderProducts, orderProductsLoading]);

  const onSubmit = async (data: OrderFormValues) => {
    setIsSubmitting(true);
    try {
      if (order) {
        // Update existing order
        await updateOrder(order.id, {
          status: data.status as OrderStatus,
          customerId: data.customerId || undefined,
          products: data.products as CreateOrderProductItemDto[],
        });
      } else {
        // Create new order
        await createOrder({
          status: data.status as OrderStatus,
          customerId: data.customerId || undefined,
          products: data.products as CreateOrderProductItemDto[],
        });
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save order:', error);
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
            {order ? 'Edit Order' : 'Create New Order'}
          </DialogTitle>
          <DialogDescription>
            {order 
              ? 'Update the order details below.' 
              : 'Create a new order by filling out the form below.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select order status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer ID (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter customer UUID" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Selection */}
            <div className="space-y-3">
              <FormLabel>Attach Products</FormLabel>
              {productsLoading ? (
                <div className="text-muted-foreground">Loading products...</div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {products.map(product => {
                    const fieldArray = form.watch('products') || [];
                    const attached = fieldArray.find(p => p.productId === product.id);
                    return (
                      <div key={product.id} className="flex items-center gap-3 p-2 border rounded">
                        <input
                          type="checkbox"
                          checked={!!attached}
                          onChange={e => {
                            if (e.target.checked) {
                              form.setValue('products', [...fieldArray, { 
                                productId: product.id, 
                                quantity: 1, 
                                price: product.price.toString() 
                              }]);
                            } else {
                              form.setValue('products', fieldArray.filter(p => p.productId !== product.id));
                            }
                          }}
                        />
                        <div className="flex-1">
                          <span className="font-medium">{product.name}</span>
                          <div className="text-xs text-muted-foreground">Rs {product.price}</div>
                        </div>
                        {attached && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={1}
                              value={attached.quantity}
                              onChange={e => {
                                const qty = Number(e.target.value);
                                form.setValue('products', fieldArray.map(p => 
                                  p.productId === product.id ? { ...p, quantity: qty } : p
                                ));
                              }}
                              className="w-16"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              value={attached.price}
                              onChange={e => {
                                const price = e.target.value;
                                form.setValue('products', fieldArray.map(p => 
                                  p.productId === product.id ? { ...p, price } : p
                                ));
                              }}
                              className="w-20"
                              placeholder="Price"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {order ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  order ? 'Update Order' : 'Create Order'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}