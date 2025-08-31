import {
  IsUUID,
  IsDecimal,
  IsDate,
  IsEnum,
} from 'class-validator';
import { PaymentMethod } from '../interfaces/payment-method';
import { PaymentStatus } from '../interfaces/payment-status';

export class PaymentDto {
  @IsUUID()
  id: string;

  @IsUUID()
  invoiceId: string;

  @IsDecimal({ decimal_digits: '2' })
  amount: string;

  @IsDate()
  paidAt: Date;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
