import useSWR, { mutate } from 'swr';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderDetails,
  getCustomerOrders,
} from '@/lib/services/order';
import type {
  OrderDto,
  CreateOrderDto,
  UpdateOrderDto,
  OrderDetailsResponseDto,
} from '@/lib/dtos/order';

// SWR Keys
const ORDERS_KEY = 'orders';
const ORDER_KEY = (id: string) => `orders/${id}`;
const ORDER_DETAILS_KEY = (id: string) => `orders/${id}/details`;
const CUSTOMER_ORDERS_KEY = (customerId: string) => `orders/customer/${customerId}`;

// Orders Hooks
export function useOrders() {
  const { data, error, isLoading } = useSWR(ORDERS_KEY, getAllOrders);
  return {
    orders: data || [],
    isLoading,
    isError: !!error,
  };
}

export function useOrder(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? ORDER_KEY(id) : null,
    () => getOrderById(id)
  );
  return {
    order: data,
    isLoading,
    isError: !!error,
  };
}

export function useOrderDetails(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? ORDER_DETAILS_KEY(id) : null,
    () => getOrderDetails(id)
  );
  return {
    orderDetails: data,
    isLoading,
    isError: !!error,
  };
}

export function useCustomerOrders(customerId: string | null) {
  const { data, error, isLoading } = useSWR(
    customerId ? CUSTOMER_ORDERS_KEY(customerId) : null,
    customerId ? () => getCustomerOrders(customerId) : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Dedupe requests within 1 minute
    }
  );
  return {
    orders: data || [],
    isLoading,
    isError: !!error,
    error,
  };
}

// Order Mutations
export function useOrderMutations() {
  const createOrderMutation = async (data: CreateOrderDto) => {
    const newOrder = await createOrder(data);
    // Update orders list cache
    mutate(ORDERS_KEY, (orders: OrderDto[] = []) => [newOrder, ...orders], false);
    mutate(ORDERS_KEY); // Revalidate
    return newOrder;
  };

  const updateOrderMutation = async (id: string, data: UpdateOrderDto) => {
    const updatedOrder = await updateOrder(id, data);
    // Update individual order cache
    mutate(ORDER_KEY(id), updatedOrder, false);
    // Update orders list cache
    mutate(ORDERS_KEY, (orders: OrderDto[] = []) => 
      orders.map(order => order.id === id ? updatedOrder : order), false);
    mutate(ORDERS_KEY); // Revalidate
    mutate(ORDER_KEY(id)); // Revalidate individual order
    return updatedOrder;
  };

  const deleteOrderMutation = async (id: string) => {
    const result = await deleteOrder(id);
    // Remove from orders list cache
    mutate(ORDERS_KEY, (orders: OrderDto[] = []) => 
      orders.filter(order => order.id !== id), false);
    mutate(ORDERS_KEY); // Revalidate
    // Clear individual order cache
    mutate(ORDER_KEY(id), undefined, false);
    return result;
  };

  return {
    createOrder: createOrderMutation,
    updateOrder: updateOrderMutation,
    deleteOrder: deleteOrderMutation,
  };
}