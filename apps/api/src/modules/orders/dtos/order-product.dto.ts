import {
  IsUUID,
  IsDecimal,
  IsInt,
  IsPositive,
} from 'class-validator';

export class OrderProductDto {
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
}
