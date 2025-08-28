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
    return await this.db.query.products.findMany({
      where: (product, { eq }) => eq(product.isDeleted, false),
    });
  }

  async findOne(id: string) {
    const product = await this.db.query.products.findFirst({
      where: (product, { eq, and }) =>
        and(eq(product.id, id), eq(product.isDeleted, false)),
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const [product] = await this.db.update(products)
      .set(updateProductDto)
      .where(and(eq(products.id, id), eq(products.isDeleted, false)))
      .returning();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async remove(id: string) {
    const [product] = await this.db.update(products)
      .set({ isDeleted: true })
      .where(eq(products.id, id))
      .returning();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return { message: 'Product deleted successfully' };
  }
}
