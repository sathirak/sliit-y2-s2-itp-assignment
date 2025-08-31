import {
  IsUUID,
  IsDecimal,
  IsDate,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatus } from '../interfaces/invoice-status';
import { OrderDto } from './order.dto';
import { PaymentDto } from './payment.dto';

export class InvoiceWithRelationsDto {
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

  @ValidateNested()
  @Type(() => OrderDto)
  @IsOptional()
  order?: OrderDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  @IsOptional()
  payments?: PaymentDto[];
}
