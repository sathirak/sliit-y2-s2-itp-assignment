import {
  IsEnum,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../interfaces/order-status';
import { CreateOrderProductItemDto } from './create-order-product.dto';

export class CreateOrderDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductItemDto)
  @IsOptional()
  products?: CreateOrderProductItemDto[];
}
