import { Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { orders } from './models/order.model';
import { OrderDto } from './dtos/order.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderProductService } from './order-product.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private readonly db: Schema,
    private readonly orderProductService: OrderProductService,
  ) {}

  async getAll(): Promise<OrderDto[]> {
    const orderList = await this.db.query.orders.findMany({
      where: (orders, { eq }) => eq(orders.isDeleted, false),
    });
    return orderList;
  }

  async getById(id: string): Promise<OrderDto> {
    const order = await this.db.query.orders.findFirst({
      where: (orders, { eq, and }) =>
        and(eq(orders.id, id), eq(orders.isDeleted, false)),
    });
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderDto> {
    const [newOrder] = await this.db
      .insert(orders)
      .values({
        status: createOrderDto.status,
        customerId: createOrderDto.customerId,
      })
      .returning();

    // Create order products if provided
    if (createOrderDto.products && createOrderDto.products.length > 0) {
      const orderProductsData = createOrderDto.products.map(product => ({
        orderId: newOrder.id,
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
      }));
      await this.orderProductService.createMultiple(orderProductsData);
    }

    return newOrder;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderDto> {
    const existingOrder = await this.getById(id);
    if (!existingOrder) {
      return null;
    }

    const [updatedOrder] = await this.db
      .update(orders)
      .set({
        status: updateOrderDto.status,
        customerId: updateOrderDto.customerId,
      })
      .where(and(eq(orders.id, id), eq(orders.isDeleted, false)))
      .returning();

    // Update order products if provided
    if (updateOrderDto.products !== undefined) {
      // Delete existing order products
      await this.orderProductService.deleteByOrderId(id);

      // Create new order products
      if (updateOrderDto.products.length > 0) {
        const orderProductsData = updateOrderDto.products.map(product => ({
          orderId: id,
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
        }));
        await this.orderProductService.createMultiple(orderProductsData);
      }
    }

    return updatedOrder;
  }

  async delete(id: string): Promise<boolean> {
    const existingOrder = await this.getById(id);
    if (!existingOrder) {
      return false;
    }

    await this.db
      .update(orders)
      .set({
        isDeleted: true,
      })
      .where(eq(orders.id, id));

    return true;
  }
}
