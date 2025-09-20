import {
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsUUID,
  IsDate,
  IsEnum,
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
  @IsPhoneNumber('LK') // You can change 'LK' to your desired region code
  phone: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  deleted: boolean;

  @IsEnum(TicketStatus)
  status: TicketStatus
}
