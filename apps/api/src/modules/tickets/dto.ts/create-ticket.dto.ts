import { OmitType } from '@nestjs/swagger';
import { TicketDto } from './ticket.dto';

export class CreateTicketDto  extends OmitType(TicketDto, ['id', 'createdAt', 'isDeleted'] as const) {
 
}