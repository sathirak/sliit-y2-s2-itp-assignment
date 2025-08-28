import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { products } from './models/product.model';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { eq, and } from 'drizzle-orm';

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

  async findAll() {
    return await this.db.select().from(products).where(eq(products.deleted, false));
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
      .where(eq(products.id, id))
      .returning();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return { message: 'Product deleted successfully' };
  }
}
