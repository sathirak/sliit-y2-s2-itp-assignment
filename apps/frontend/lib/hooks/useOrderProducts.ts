import useSWR, { mutate } from 'swr';
import {
  getAllOrderProducts,
  getOrderProductById,
  getOrderProductsByOrderId,
  createOrderProduct,
  createMultipleOrderProducts,
  updateOrderProduct,
  deleteOrderProduct,
  deleteOrderProductsByOrderId,
} from '@/lib/services/order';
import type {
  OrderProductDto,
  CreateOrderProductDto,
  UpdateOrderProductDto,
} from '@/lib/dtos/order';

const ORDER_PRODUCTS_KEY = 'order-products';
const ORDER_PRODUCT_KEY = (id: string) => `order-products/${id}`;
const ORDER_PRODUCTS_BY_ORDER_KEY = (orderId: string) => `order-products/order/${orderId}`;

export function useOrderProducts() {
  const { data, error, isLoading } = useSWR(ORDER_PRODUCTS_KEY, getAllOrderProducts);
  return {
    orderProducts: data || [],
    isLoading,
    isError: !!error,
  };
}

export function useOrderProduct(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? ORDER_PRODUCT_KEY(id) : null,
    () => getOrderProductById(id)
  );
  return {
    orderProduct: data,
    isLoading,
    isError: !!error,
  };
}

export function useOrderProductsByOrderId(orderId: string) {
  const { data, error, isLoading } = useSWR(
    orderId ? ORDER_PRODUCTS_BY_ORDER_KEY(orderId) : null,
    () => getOrderProductsByOrderId(orderId)
  );
  return {
    orderProducts: data || [],
    isLoading,
    isError: !!error,
  };
}

export function useOrderProductMutations() {
  const createOrderProductMutation = async (data: CreateOrderProductDto) => {
    const newOrderProduct = await createOrderProduct(data);
    mutate(ORDER_PRODUCTS_KEY, (orderProducts = []) => [newOrderProduct, ...orderProducts], false);
    mutate(ORDER_PRODUCTS_BY_ORDER_KEY(data.orderId), (orderProducts = []) => [newOrderProduct, ...orderProducts], false);
    mutate(ORDER_PRODUCTS_KEY);
    mutate(ORDER_PRODUCTS_BY_ORDER_KEY(data.orderId));
    return newOrderProduct;
  };

  const createMultipleOrderProductsMutation = async (data: CreateOrderProductDto[]) => {
    const newOrderProducts = await createMultipleOrderProducts(data);
    if (data.length > 0) {
      const orderId = data[0].orderId;
      mutate(ORDER_PRODUCTS_KEY, (orderProducts = []) => [...newOrderProducts, ...orderProducts], false);
      mutate(ORDER_PRODUCTS_BY_ORDER_KEY(orderId), (orderProducts = []) => [...newOrderProducts, ...orderProducts], false);
      mutate(ORDER_PRODUCTS_KEY);
      mutate(ORDER_PRODUCTS_BY_ORDER_KEY(orderId));
    }
    return newOrderProducts;
  };

  const updateOrderProductMutation = async (id: string, data: UpdateOrderProductDto) => {
    const updatedOrderProduct = await updateOrderProduct(id, data);
    mutate(ORDER_PRODUCT_KEY(id), updatedOrderProduct, false);
    mutate(ORDER_PRODUCTS_KEY);
    if (data.orderId) {
      mutate(ORDER_PRODUCTS_BY_ORDER_KEY(data.orderId));
    }
    return updatedOrderProduct;
  };

  const deleteOrderProductMutation = async (id: string, orderId?: string) => {
    const result = await deleteOrderProduct(id);
    mutate(ORDER_PRODUCTS_KEY, (orderProducts: OrderProductDto[] = []) => orderProducts.filter(op => op.id !== id), false);
    if (orderId) {
      mutate(ORDER_PRODUCTS_BY_ORDER_KEY(orderId), (orderProducts: OrderProductDto[] = []) => orderProducts.filter(op => op.id !== id), false);
    }
    mutate(ORDER_PRODUCTS_KEY);
    if (orderId) {
      mutate(ORDER_PRODUCTS_BY_ORDER_KEY(orderId));
    }
    return result;
  };

  const deleteOrderProductsByOrderIdMutation = async (orderId: string) => {
    const result = await deleteOrderProductsByOrderId(orderId);
    mutate(ORDER_PRODUCTS_BY_ORDER_KEY(orderId), [], false);
    mutate(ORDER_PRODUCTS_KEY);
    mutate(ORDER_PRODUCTS_BY_ORDER_KEY(orderId));
    return result;
  };

  return {
    createOrderProduct: createOrderProductMutation,
    createMultipleOrderProducts: createMultipleOrderProductsMutation,
    updateOrderProduct: updateOrderProductMutation,
    deleteOrderProduct: deleteOrderProductMutation,
    deleteOrderProductsByOrderId: deleteOrderProductsByOrderIdMutation,
  };
}