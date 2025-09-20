import {
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDto } from './order.dto';
import { InvoiceDto } from './invoice.dto';
import { OrderProductDto } from './order-product.dto';

export class CheckoutResponseDto {
  @ValidateNested()
  @Type(() => OrderDto)
  order: OrderDto;

  @ValidateNested()
  @Type(() => InvoiceDto)
  invoice: InvoiceDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  orderProducts: OrderProductDto[];
}
