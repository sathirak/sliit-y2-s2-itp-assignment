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
  Trash2, 
  FileText, 
  Loader2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/modules/ui/alert-dialog';
import { OrderDialog } from './OrderDialog';
import { useOrderMutations } from '@/lib/hooks/useOrders';
import type { OrderDto, OrderStatus } from '@/lib/dtos/order';

interface OrdersTableProps {
  orders: OrderDto[];
  isLoading: boolean;
  searchTerm: string;
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

export function OrdersTable({ orders, isLoading, searchTerm }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<OrderDto | null>(null);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  
  const { deleteOrder } = useOrderMutations();

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customerId && order.customerId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditOrder = (order: OrderDto) => {
    setSelectedOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleDeleteOrder = (order: OrderDto) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    setIsDeletingOrder(true);
    try {
      await deleteOrder(orderToDelete.id);
      setIsDeleteDialogOpen(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Failed to delete order:', error);
    } finally {
      setIsDeletingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No orders found</h3>
        <p className="text-gray-500">
          {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new order.'}
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
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(order.status)}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.customerId ? (
                    <span className="text-sm">
                      {order.customerId.slice(0, 8)}...
                    </span>
                  ) : (
                    <span className="text-gray-400">No customer</span>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
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
                      <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteOrder(order)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Order Dialog */}
      <OrderDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        order={selectedOrder}
        onClose={() => {
          setSelectedOrder(null);
          setIsEditDialogOpen(false);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingOrder}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteOrder}
              disabled={isDeletingOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}