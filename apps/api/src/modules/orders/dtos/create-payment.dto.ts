import {
  IsUUID,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { PaymentMethod } from '../interfaces/payment-method';
import { PaymentStatus } from '../interfaces/payment-status';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  invoiceId: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  amount: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  status: PaymentStatus;
}
