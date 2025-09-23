export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED'
}

export interface Ticket {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  notes?: string;
  createdAt: Date;
  deleted: boolean;
  status: TicketStatus;
}

export interface CreateTicketDto {
  name: string;
  email: string;
  phone: string;
  message: string;
  notes?: string;
}

export interface UpdateTicketDto {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  status?: TicketStatus;
  notes?: string;
}