import {
  IsEnum,
  IsOptional,
} from 'class-validator';
import { OrderStatus } from '../interfaces/order-status';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
