import { CreateTicketDto } from './create-ticket.dto';

export class UpdateTicketDto extends CreateTicketDto {
	// Allow partial update for notes, status, etc.
	notes?: string;
	status?: string;
}