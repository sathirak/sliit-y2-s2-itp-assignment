import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { orderProducts } from './models/order-product.model';
import { OrderProductDto } from './dtos/order-product.dto';
import { OrderProductWithRelationsDto } from './dtos/order-product-with-relations.dto';
import { CreateOrderProductDto } from './dtos/create-order-product.dto';

@Injectable()
export class OrderProductService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private readonly db: Schema,
  ) {}

  async getAll(): Promise<OrderProductWithRelationsDto[]> {
    const orderProductList = await this.db.query.orderProducts.findMany({
      with: {
        order: true,
        product: true,
      },
    });
    return orderProductList;
  }

  async getById(id: string): Promise<OrderProductWithRelationsDto> {
    const orderProduct = await this.db.query.orderProducts.findFirst({
      where: (orderProducts, { eq }) => eq(orderProducts.id, id),
      with: {
        order: true,
        product: true,
      },
    });
    return orderProduct;
  }

  async getByOrderId(orderId: string): Promise<OrderProductWithRelationsDto[]> {
    const orderProductList = await this.db.query.orderProducts.findMany({
      where: (orderProducts, { eq }) => eq(orderProducts.orderId, orderId),
      with: {
        order: true,
        product: true,
      },
    });
    return orderProductList;
  }

  async create(createOrderProductDto: CreateOrderProductDto): Promise<OrderProductDto> {
    const [newOrderProduct] = await this.db
      .insert(orderProducts)
      .values({
        orderId: createOrderProductDto.orderId,
        productId: createOrderProductDto.productId,
        quantity: createOrderProductDto.quantity,
        price: createOrderProductDto.price,
      })
      .returning();
    return newOrderProduct;
  }

  async createMultiple(orderProductsData: CreateOrderProductDto[]): Promise<OrderProductDto[]> {
    const newOrderProducts = await this.db
      .insert(orderProducts)
      .values(orderProductsData)
      .returning();
    return newOrderProducts;
  }

  async update(id: string, updateData: Partial<CreateOrderProductDto>): Promise<OrderProductDto> {
    const [updatedOrderProduct] = await this.db
      .update(orderProducts)
      .set(updateData)
      .where(eq(orderProducts.id, id))
      .returning();
    return updatedOrderProduct;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(orderProducts)
      .where(eq(orderProducts.id, id))
      .returning();
    return result.length > 0;
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    await this.db
      .delete(orderProducts)
      .where(eq(orderProducts.orderId, orderId));
  }
}
