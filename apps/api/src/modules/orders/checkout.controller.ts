import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutDto } from './dtos/checkout.dto';
import { CheckoutResponseDto } from './dtos/checkout-response.dto';
import { OrderDetailsResponseDto } from './dtos/order-details-response.dto';
import { OrderDto } from './dtos/order.dto';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
@ApiTags('Checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async processCheckout(@Body() checkoutDto: CheckoutDto): Promise<CheckoutResponseDto> {
    return this.checkoutService.processCheckout(checkoutDto);
  }

  @Get('customer/:customerId/orders')
  async getCustomerOrders(@Param('customerId') customerId: string): Promise<OrderDto[]> {
    return this.checkoutService.getCustomerOrders(customerId);
  }

  @Get('order/:orderId/details')
  async getOrderDetails(@Param('orderId') orderId: string): Promise<OrderDetailsResponseDto> {
    const orderDetails = await this.checkoutService.getOrderDetails(orderId);
    if (!orderDetails.order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return orderDetails;
  }
}
