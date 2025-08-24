import {
  IsEnum,
  IsNotEmpty,
  IsDate,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { OrderStatus } from '../interfaces/order-status';

export class OrderDto {
  @IsUUID()
  id: string;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @IsDate()
  createdAt: Date;

  @IsBoolean()
  isDeleted: boolean;
}
