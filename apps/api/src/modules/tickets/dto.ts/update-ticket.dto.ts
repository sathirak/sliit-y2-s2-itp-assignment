import { PartialType } from '@nestjs/swagger';
import { TicketDto } from './ticket.dto';

// All fields optional for PATCH/PUT
export class UpdateTicketDto extends PartialType(TicketDto) {}