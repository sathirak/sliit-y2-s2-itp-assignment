import useSWR from 'swr';
import { productService } from '@/lib/services/product.service';
import type { Product, ProductFilterDto, PaginatedResponse } from '@/lib/dtos/product';

export function useProducts(filters: ProductFilterDto = {}) {
  const { data, error, isLoading } = useSWR(['products', filters], () => productService.getProducts(filters));
  return {
    products: data?.data || [],
    isLoading,
    isError: !!error,
    pagination: {
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1,
    },
  };
}
