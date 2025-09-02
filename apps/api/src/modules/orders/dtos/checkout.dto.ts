import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
  IsDecimal,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsDecimal({ decimal_digits: '2' })
  price: string;
}

export class CheckoutDto {
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
