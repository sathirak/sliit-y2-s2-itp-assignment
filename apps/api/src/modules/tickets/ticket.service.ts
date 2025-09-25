import { UpdateTicketDto } from "./dto.ts/update-ticket.dto";
import { Inject, NotFoundException } from "@nestjs/common";
import type { Schema } from "src/common/types/db";
import { DatabaseAsyncProvider } from "src/database/database.provider";
import { TicketDto } from "./dto.ts/ticket.dto";
import { tickets } from "./models/ticket.model";
import { CreateTicketDto } from "./dto.ts/create-ticket.dto";
import { and, eq, or, ilike } from "drizzle-orm";
import type { TicketStatus } from 'src/modules/tickets/interfaces/tickets';


export class TicketService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private db: Schema,
  ) { }

  async getTicket(status?: string, search?: string): Promise<TicketDto[]> {
    let whereConditions = [eq(tickets.deleted, false)];

    // Filter by status if provided
    if (status) {
      whereConditions.push(eq(tickets.status, status as TicketStatus));
    }

    // Search functionality
    if (search) {
      const searchPattern = `%${search}%`;
      whereConditions.push(
        or(
          ilike(tickets.name, searchPattern),
          ilike(tickets.email, searchPattern),
          ilike(tickets.message, searchPattern)
        )
      );
    }

    const ticket = await this.db.query.tickets.findMany({
      where: and(...whereConditions),
      orderBy: (tickets, { desc }) => [desc(tickets.createdAt)]
    });

    return ticket;
  }

  async getTicketById(ticketId: string): Promise<TicketDto> {
    const ticket = await this.db.query.tickets.findFirst({
      where: (tickets, { eq, and }) =>
        and(eq(tickets.id, ticketId), eq(tickets.deleted, false)),
    });

    return ticket;
  }
  
  async create(data: CreateTicketDto): Promise<TicketDto> {
    const [created] = await this.db.insert(tickets)
      .values({
        name: data.name,
        message: data.message,
        email: data.email,
        phone: data.phone,
        notes: data.notes,
      })
      .returning();
    return created;
  }

  async update(id: string, data: UpdateTicketDto): Promise<TicketDto> {
    const [updated] = await this.db.update(tickets)
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.message !== undefined && { message: data.message }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.status !== undefined && { status: data.status as TicketStatus }),
        ...(data.notes !== undefined && { notes: data.notes }),
      })
      .where(and(eq(tickets.id, id), eq(tickets.deleted, false)))
      .returning();
    if (!updated) throw new NotFoundException('Ticket not found');
    return updated;
  }
  async delete(id: string): Promise<boolean> {
    const [deleted] = await this.db.update(tickets)
      .set({ deleted: true })
      .where(eq(tickets.id, id))
      .returning();
    return !!deleted;
  }
}
