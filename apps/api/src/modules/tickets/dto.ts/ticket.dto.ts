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
  Matches,
} from 'class-validator';
import { TicketStatus } from '../interfaces/tickets';

export class TicketDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Matches(
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    { message: 'Please enter a valid email format (e.g., user@example.com)' }
  )
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
