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

import { CalendarDays, User, Package, DollarSign, Loader2 } from 'lucide-react';
import { useOrderDetails } from '@/lib/hooks/useOrders';
import type { OrderWithRelationsDto, OrderDto, OrderStatus } from '@/lib/dtos/order';

interface OrderDetailDialogProps {
  order: OrderWithRelationsDto | OrderDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  // Fetch detailed order information when dialog is open and order is available
  const { orderDetails, isLoading, isError } = useOrderDetails(order?.id || '');
  
  if (!order) return null;

  // Use detailed order data if available, otherwise fall back to basic order
  const detailedOrder = orderDetails?.order || order;
  const orderProducts = orderDetails?.orderProducts || [];
  const invoices = orderDetails?.invoices || [];

  const totalAmount = orderProducts.length > 0
    ? orderProducts.reduce((sum, product) => 
        sum + (parseFloat(product.price) * product.quantity), 0
      )
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </DialogTitle>
          <DialogDescription>
            Detailed information for order #{order.id}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading order details...</span>
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-red-600">
            <p>Failed to load order details. Showing basic information only.</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Order ID</p>
                    <p className="text-sm text-muted-foreground">{detailedOrder.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(detailedOrder.createdAt), 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Customer ID</p>
                    <p className="text-sm text-muted-foreground">
                      {detailedOrder.customerId || 'Guest'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total Amount</p>
                    <p className="text-sm text-muted-foreground">
                      ${totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-4" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className={getStatusColor(detailedOrder.status)}>
                  {detailedOrder.status.charAt(0).toUpperCase() + detailedOrder.status.slice(1)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Deleted</span>
                <Badge variant={detailedOrder.isDeleted ? 'destructive' : 'secondary'}>
                  {detailedOrder.isDeleted ? 'Yes' : 'No'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Products */}
          {orderProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderProducts.map((product, index) => (
                    <div key={product.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {product.product?.name || `Product ID: ${product.productId}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {product.product?.description || 'No description available'}
                        </p>
                        {!product.product && (
                          <p className="text-xs text-gray-400">Product ID: {product.productId}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Qty: {product.quantity}</p>
                        <p className="text-sm text-muted-foreground">
                          ${parseFloat(product.price).toFixed(2)} each
                        </p>
                        <p className="font-semibold">
                          ${(parseFloat(product.price) * product.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invoices */}
          {invoices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Invoice #{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Issued: {format(new Date(invoice.issuedAt), 'PPP')}
                        </p>
                        {invoice.dueDate && (
                          <p className="text-sm text-muted-foreground">
                            Due: {format(new Date(invoice.dueDate), 'PPP')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${parseFloat(invoice.amount).toFixed(2)}</p>
                        <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {invoice.status}
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