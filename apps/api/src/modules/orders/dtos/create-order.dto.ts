import {
  IsEnum,
  IsNotEmpty,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { OrderStatus } from '../interfaces/order-status';

export class CreateOrderDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @IsUUID()
  @IsOptional()
  customerId?: string;
}
