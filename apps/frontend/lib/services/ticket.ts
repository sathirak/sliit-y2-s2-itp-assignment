import { CreateTicketDto, Ticket, UpdateTicketDto } from '../dtos/ticket';
import { apiPublicClient } from '../public';

export const getTickets = async (): Promise<Ticket[]> => {
    return apiPublicClient.get('ticket').json<Ticket[]>();
};

export const getTicket = async (id: string): Promise<Ticket> => {
    return apiPublicClient.get(`ticket/${id}`).json<Ticket>();
};

export const createTicket = async (ticket: CreateTicketDto): Promise<Ticket> => {
    return apiPublicClient.post('ticket', { json: ticket }).json<Ticket>();
};

export const updateTicket = async (id: string, ticket: UpdateTicketDto): Promise<Ticket> => {
    return apiPublicClient.put(`ticket/${id}`, { json: ticket }).json<Ticket>();
};

export const deleteTicket = async (id: string): Promise<void> => {
    await apiPublicClient.delete(`ticket/${id}`);
};