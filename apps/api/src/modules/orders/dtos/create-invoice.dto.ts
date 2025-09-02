import {
  IsUUID,
  IsDecimal,
  IsDate,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { InvoiceStatus } from '../interfaces/invoice-status';

export class CreateInvoiceDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  amount: string;

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsEnum(InvoiceStatus)
  @IsNotEmpty()
  status: InvoiceStatus;
}
