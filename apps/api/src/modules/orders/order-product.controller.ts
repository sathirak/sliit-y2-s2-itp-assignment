import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderProductDto } from './dtos/order-product.dto';
import { OrderProductWithRelationsDto } from './dtos/order-product-with-relations.dto';
import { CreateOrderProductDto } from './dtos/create-order-product.dto';
import { UpdateOrderProductDto } from './dtos/update-order-product.dto';
import { OrderProductService } from './order-product.service';

@Controller('order-product')
@ApiTags('Order Product')
export class OrderProductController {
  constructor(private readonly orderProductService: OrderProductService) {}

  @Get()
  async getAll(): Promise<OrderProductWithRelationsDto[]> {
    return this.orderProductService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<OrderProductWithRelationsDto> {
    const orderProduct = await this.orderProductService.getById(id);
    if (!orderProduct) {
      throw new NotFoundException(`Order product with ID ${id} not found`);
    }
    return orderProduct;
  }

  @Get('order/:orderId')
  async getByOrderId(@Param('orderId') orderId: string): Promise<OrderProductWithRelationsDto[]> {
    return this.orderProductService.getByOrderId(orderId);
  }

  @Post()
  async create(@Body() createOrderProductDto: CreateOrderProductDto): Promise<OrderProductDto> {
    return this.orderProductService.create(createOrderProductDto);
  }

  @Post('bulk')
  async createMultiple(@Body() createOrderProductDtos: CreateOrderProductDto[]): Promise<OrderProductDto[]> {
    return this.orderProductService.createMultiple(createOrderProductDtos);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderProductDto: UpdateOrderProductDto,
  ): Promise<OrderProductDto> {
    const orderProduct = await this.orderProductService.update(id, updateOrderProductDto);
    if (!orderProduct) {
      throw new NotFoundException(`Order product with ID ${id} not found`);
    }
    return orderProduct;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.orderProductService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Order product with ID ${id} not found`);
    }
    return { message: 'Order product deleted successfully' };
  }

  @Delete('order/:orderId')
  async deleteByOrderId(@Param('orderId') orderId: string): Promise<{ message: string }> {
    await this.orderProductService.deleteByOrderId(orderId);
    return { message: 'Order products deleted successfully' };
  }
}