import {
  IsUUID,
  IsDecimal,
  IsInt,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

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
