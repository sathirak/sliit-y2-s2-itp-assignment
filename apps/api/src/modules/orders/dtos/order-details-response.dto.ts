import {
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderWithRelationsDto } from './order-with-relations.dto';
import { OrderProductWithRelationsDto } from './order-product-with-relations.dto';
import { InvoiceWithRelationsDto } from './invoice-with-relations.dto';

export class OrderDetailsResponseDto {
  @ValidateNested()
  @Type(() => OrderWithRelationsDto)
  order: OrderWithRelationsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductWithRelationsDto)
  orderProducts: OrderProductWithRelationsDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceWithRelationsDto)
  invoices: InvoiceWithRelationsDto[];
}
