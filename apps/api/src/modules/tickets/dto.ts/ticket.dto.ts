import {
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsUUID,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { TicketStatus } from '../interfaces/tickets';

export class TicketDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('LK')
  phone: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDate()
  createdAt: Date;

  @IsBoolean()
  deleted: boolean;

  @IsEnum(TicketStatus)
  status: TicketStatus;
}
