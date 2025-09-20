import {
  IsUUID,
  IsDecimal,
  IsDate,
  IsEnum,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../interfaces/payment-method';
import { PaymentStatus } from '../interfaces/payment-status';
import { InvoiceWithRelationsDto } from './invoice-with-relations.dto';

export class PaymentWithRelationsDto {
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

  @ValidateNested()
  @Type(() => InvoiceWithRelationsDto)
  @IsOptional()
  invoice?: InvoiceWithRelationsDto;
}
