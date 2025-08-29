import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { products } from './models/product.model';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductFilterDto } from './dtos/product-filter.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { PaginationUtil } from '../../common/utils/pagination.util';
import { eq, and, gte, lte, sql, like, or } from 'drizzle-orm';

@Injectable()
export class ProductService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private readonly db: Schema,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const [product] = await this.db.insert(products)
      .values(createProductDto)
      .returning();
    return product;
  }

  async findAll(filters: ProductFilterDto): Promise<PaginatedResponseDto<any>> {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      size,
      color,
      minPrice,
      maxPrice,
      minQty,
      maxQty,
      availability,
    } = filters;

    // Build where clause with search and filters
    const additionalFilters: any[] = [eq(products.deleted, false)];

    // Add search functionality - fixed to use proper drizzle syntax
    if (search) {
      const searchConditions = [
        like(products.name, `%${search}%`),
        like(products.description, `%${search}%`),
        like(products.category, `%${search}%`),
      ];
      additionalFilters.push(or(...searchConditions));
    }

    // Add specific filters
    if (category) {
      additionalFilters.push(eq(products.category, category));
    }
    if (size) {
      additionalFilters.push(eq(products.size, size));
    }
    if (color) {
      additionalFilters.push(eq(products.color, color));
    }
    if (minPrice !== undefined) {
      additionalFilters.push(gte(sql`CAST(${products.price} AS DECIMAL)`, minPrice));
    }
    if (maxPrice !== undefined) {
      additionalFilters.push(lte(sql`CAST(${products.price} AS DECIMAL)`, maxPrice));
    }
    if (minQty !== undefined) {
      additionalFilters.push(gte(products.qty, minQty));
    }
    if (maxQty !== undefined) {
      additionalFilters.push(lte(products.qty, maxQty));
    }
    if (availability === 'out_of_stock') {
      additionalFilters.push(eq(products.qty, 0));
    } else if (availability === 'in_stock') {
      additionalFilters.push(sql`${products.qty} > 0`);
    }

    const whereClause = additionalFilters.length > 0 ? and(...additionalFilters) : undefined;

    // Get total count for pagination
    const totalResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);
    
    const total = totalResult[0]?.count || 0;

    // Get paginated results - always order by created_at desc for consistency
    const offset = PaginationUtil.getOffset(page, limit);
    const results = await this.db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(sql`${products.created_at} DESC`)
      .limit(limit)
      .offset(offset);

    // Calculate pagination metadata
    const pagination = PaginationUtil.calculatePagination(page, limit, total);

    return {
      data: results,
      pagination,
    };
  }

  async findOne(id: string) {
    const product = await this.db.select().from(products).where(and(eq(products.id, id), eq(products.deleted, false))).limit(1);
    
    if (!product.length) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product[0];
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const [product] = await this.db.update(products)
      .set(updateProductDto)
      .where(and(eq(products.id, id), eq(products.deleted, false)))
      .returning();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async remove(id: string) {
    const [product] = await this.db.update(products)
      .set({ deleted: true })
      .where(and(eq(products.id, id), eq(products.deleted, false)))
      .returning();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return { message: 'Product deleted successfully' };
  }

  // Helper method to get all products without pagination (for backward compatibility)
  async findAllSimple() {
    return await this.db.select().from(products).where(eq(products.deleted, false));
  }
}
