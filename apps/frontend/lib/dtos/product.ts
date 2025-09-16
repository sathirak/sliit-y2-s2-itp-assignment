export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  size: string;
  color: string;
  qty: number;
  price: string;
  product_image: string;
  created_at: Date;
  deleted: boolean;
}

export interface CreateProductDto {
  name: string;
  category: string;
  description: string;
  size: string;
  color: string;
  qty: number;
  price: string;
  product_image: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  minQty?: number;
  maxQty?: number;
  availability?: 'in_stock' | 'out_of_stock';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
