import useSWR from 'swr';
import { productService } from '../services/product.service';
import { Product, ProductFilterDto, PaginatedResponse } from '../dtos/product';

export const useProducts = (filters: ProductFilterDto = {}) => {
  const { data, error, isLoading, mutate } = useSWR(
    ['products', filters],
    () => productService.getProducts(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    products: data?.data || [],
    pagination: data ? {
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages,
    } : null,
    isLoading,
    error,
    mutate,
  };
};

export const useProduct = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ['product', id] : null,
    () => productService.getProduct(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    product: data,
    isLoading,
    error,
    mutate,
  };
};

// Hook specifically for new arrivals (latest products)
export const useNewArrivals = (limit: number = 8) => {
  const { data, error, isLoading, mutate } = useSWR(
    ['new-arrivals', limit],
    () => productService.getProducts({ 
      limit,
      page: 1,
      // You could add additional filters here like sorting by created_at desc
      // But since the API doesn't seem to have explicit sorting, we'll work with what we get
    }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    products: data?.data || [],
    isLoading,
    error,
    mutate,
  };
};
