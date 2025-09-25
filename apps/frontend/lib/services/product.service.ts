import { Product, CreateProductDto, UpdateProductDto, ProductFilterDto, PaginatedResponse } from '../dtos/product';
import { apiPrivateClient } from '../private';
import { apiPublicClient } from '../public';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ProductService {
  // For backward compatibility with existing public endpoints
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getProducts(filters: ProductFilterDto = {}): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      
      if (value === undefined || value === null || value === '') {
        return;
      }
    
      if ((key === 'minPrice' || key === 'maxPrice' || key === 'minQty' || key === 'maxQty') && value === 0) {
        return;
      }
      searchParams.append(key, value.toString());
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products/all');
  }

  // Admin operations - require authentication
  async createProduct(product: CreateProductDto): Promise<Product> {
    try {
      return await apiPrivateClient.post('products', { json: product }).json<Product>();
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized: Admin access required to create products');
      }
      throw new Error(error.message || 'Failed to create product');
    }
  }

  async updateProduct(id: string, product: UpdateProductDto): Promise<Product> {
    try {
      return await apiPrivateClient.patch(`products/${id}`, { json: product }).json<Product>();
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized: Admin access required to update products');
      }
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(error.message || 'Failed to update product');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiPrivateClient.delete(`products/${id}`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized: Admin access required to delete products');
      }
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(error.message || 'Failed to delete product');
    }
  }
}

export const productService = new ProductService();
