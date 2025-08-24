import { Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { orders } from './models/order.model';
import { OrderDto } from './dtos/order.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private readonly db: Schema,
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
      })
      .returning();
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
      })
      .where(and(eq(orders.id, id), eq(orders.isDeleted, false)))
      .returning();

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
