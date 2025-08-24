import {
 IsNotEmpty,
 IsDate,
 IsBoolean,
 IsUUID,
} from 'class-validator';

export class TicketDto {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsDate()
  createdAt: Date;

  @IsBoolean()
  isDeleted: boolean;
}