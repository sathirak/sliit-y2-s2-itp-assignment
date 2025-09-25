import {
  IsUUID,
  IsDecimal,
  IsInt,
  IsPositive,
  IsNotEmpty,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderProductItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  price: string;
}

export class CreateOrderProductDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  price: string;
}
