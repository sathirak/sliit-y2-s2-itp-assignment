import { Injectable } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderProductService } from './order-product.service';
import { InvoiceService } from './invoice.service';
import { CheckoutDto } from './dtos/checkout.dto';
import { CheckoutResponseDto } from './dtos/checkout-response.dto';
import { OrderDetailsResponseDto } from './dtos/order-details-response.dto';
import { OrderDto } from './dtos/order.dto';
import { OrderStatus } from './interfaces/order-status';
import { InvoiceStatus } from './interfaces/invoice-status';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderProductService: OrderProductService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async processCheckout(checkoutDto: CheckoutDto): Promise<CheckoutResponseDto> {
    // 1. Create the order
    const order = await this.orderService.create({
      status: OrderStatus.PENDING,
      customerId: checkoutDto.customerId,
    });

    // 2. Create order products
    const orderProductsData = checkoutDto.items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const orderProducts = await this.orderProductService.createMultiple(orderProductsData);

    // 3. Calculate total amount
    const totalAmount = checkoutDto.items.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);

    // 4. Create invoice
    const invoice = await this.invoiceService.create({
      orderId: order.id,
      amount: totalAmount.toFixed(2),
      status: InvoiceStatus.UNPAID,
    });

    return {
      order,
      invoice,
      orderProducts,
    };
  }

  async getCustomerOrders(customerId: string): Promise<OrderDto[]> {
    const orders = await this.orderService.getAll();
    return orders.filter(order => order.customerId === customerId);
  }

  async getOrderDetails(orderId: string): Promise<OrderDetailsResponseDto> {
    const order = await this.orderService.getById(orderId);
    const orderProducts = await this.orderProductService.getByOrderId(orderId);
    const invoices = await this.invoiceService.getByOrderId(orderId);

    return {
      order,
      orderProducts,
      invoices,
    };
  }
}
