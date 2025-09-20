import {
  IsUUID,
  IsEnum,
  IsDate,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../interfaces/order-status';
import { InvoiceDto } from './invoice.dto';
import { OrderProductDto } from './order-product.dto';

export class OrderWithRelationsDto {
  @IsUUID()
  id: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsDate()
  createdAt: Date;

  @IsBoolean()
  isDeleted: boolean;

  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  @IsOptional()
  invoices?: InvoiceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  @IsOptional()
  orderProducts?: OrderProductDto[];
}
