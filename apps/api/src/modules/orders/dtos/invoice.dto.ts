import {
  IsUUID,
  IsDecimal,
  IsDate,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { InvoiceStatus } from '../interfaces/invoice-status';

export class InvoiceDto {
  @IsUUID()
  id: string;

  @IsUUID()
  orderId: string;

  @IsDecimal({ decimal_digits: '2' })
  amount: string;

  @IsDate()
  issuedAt: Date;

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;
}
