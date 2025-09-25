import useSWR, { mutate } from 'swr';
import { Ticket, CreateTicketDto, UpdateTicketDto, TicketFilterDto } from '../dtos/ticket';
import { getTickets, getTicket, createTicket, updateTicket, deleteTicket } from '../services/ticket';

const TICKETS_KEY = 'tickets';
const FILTERED_TICKETS_KEY = (filters: TicketFilterDto) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  return `tickets?${params.toString()}`;
};
const TICKET_KEY = (id: string) => `tickets/${id}`;

export function useTickets(filters?: TicketFilterDto) {
  const key = filters && (filters.status || filters.search) 
    ? FILTERED_TICKETS_KEY(filters) 
    : TICKETS_KEY;
    
  const fetcher = () => getTickets(filters);
  
  const { data, error, isLoading, mutate: mutateTickets } = useSWR<Ticket[]>(key, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
  return {
    tickets: data || [],
    isLoading,
    isError: !!error,
    error,
    mutateTickets,
  };
}

export function useTicket(id: string | null) {
  const { data, error, isLoading } = useSWR<Ticket>(id ? TICKET_KEY(id) : null, id ? () => getTicket(id) : null, {
    revalidateOnFocus: false,
  });
  return {
    ticket: data,
    isLoading,
    isError: !!error,
    error,
  };
}

export function useTicketMutations() {
  const createTicketMutation = async (ticketData: CreateTicketDto) => {
    const newTicket = await createTicket(ticketData);
    mutate(TICKETS_KEY, (tickets: Ticket[] = []) => [newTicket, ...tickets], false);
    mutate(TICKETS_KEY);
    return newTicket;
  };

  const updateTicketMutation = async (id: string, ticketData: UpdateTicketDto) => {
    const updatedTicket = await updateTicket(id, ticketData);
    mutate(TICKETS_KEY, (tickets: Ticket[] = []) => tickets.map(ticket => ticket.id === id ? updatedTicket : ticket), false);
    mutate(TICKET_KEY(id), updatedTicket, false);
    mutate(TICKETS_KEY);
    mutate(TICKET_KEY(id));
    return updatedTicket;
  };

  const deleteTicketMutation = async (id: string) => {
    await deleteTicket(id);
    mutate(TICKETS_KEY, (tickets: Ticket[] = []) => tickets.filter(ticket => ticket.id !== id), false);
    mutate(TICKET_KEY(id), undefined, false);
    mutate(TICKETS_KEY);
  };

  return {
    createTicket: createTicketMutation,
    updateTicket: updateTicketMutation,
    deleteTicket: deleteTicketMutation,
  };
}

export function refreshTickets() {
  return mutate(TICKETS_KEY);
}

export function refreshTicket(id: string) {
  return mutate(TICKET_KEY(id));
}
