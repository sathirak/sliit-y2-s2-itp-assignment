import {
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { OrderStatus } from '../interfaces/order-status';

export class CreateOrderDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
