import {
  IsUUID,
  IsDecimal,
  IsInt,
  IsPositive,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateOrderProductDto {
  @IsUUID()
  @IsOptional()
  orderId?: string;

  @IsUUID()
  @IsOptional()
  productId?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  price?: string;
}