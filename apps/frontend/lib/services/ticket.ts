import { apiPrivateClient } from '@/lib/private';
import { CreateTicketDto, Ticket, UpdateTicketDto } from '../dtos/ticket';
import { apiPublicClient } from '@/lib/public';

export const getTickets = async (): Promise<Ticket[]> => {
    return apiPrivateClient.get('ticket').json<Ticket[]>();
};

export const getTicket = async (id: string): Promise<Ticket> => {
    return apiPrivateClient.get(`ticket/${id}`).json<Ticket>();
};

export const createTicket = async (ticket: CreateTicketDto): Promise<Ticket> => {
    return apiPublicClient.post('ticket', { json: ticket }).json<Ticket>();
};

export const updateTicket = async (id: string, ticket: UpdateTicketDto): Promise<Ticket> => {
    return apiPrivateClient.put(`ticket/${id}`, { json: ticket }).json<Ticket>();
};

export const deleteTicket = async (id: string): Promise<void> => {
    await apiPrivateClient.delete(`ticket/${id}`);
};