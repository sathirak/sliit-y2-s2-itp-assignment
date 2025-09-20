import {
  IsUUID,
  IsDecimal,
  IsInt,
  IsPositive,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDto } from './order.dto';

// We'll need to import the product DTO when it's available
// For now, creating a basic product interface
export class BasicProductDto {
  @IsUUID()
  id: string;

  // Add other basic product fields as needed
  name?: string;
  description?: string;
  price?: string;
}

export class OrderProductWithRelationsDto {
  @IsUUID()
  id: string;

  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsDecimal({ decimal_digits: '2' })
  price: string;

  @ValidateNested()
  @Type(() => OrderDto)
  @IsOptional()
  order?: OrderDto;

  @ValidateNested()
  @Type(() => BasicProductDto)
  @IsOptional()
  product?: BasicProductDto;
}
