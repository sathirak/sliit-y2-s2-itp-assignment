import {
 
  IsNotEmpty,
  
  IsDate,
 
} from 'class-validator';

export class TicketDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  isDeleted: boolean;
}