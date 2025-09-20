import { UpdateTicketDto } from "./dto.ts/update-ticket.dto";
import { Inject, NotFoundException } from "@nestjs/common";
import type { Schema } from "src/common/types/db";
import { DatabaseAsyncProvider } from "src/database/database.provider";
import { TicketDto } from "./dto.ts/ticket.dto";
import { tickets } from "./models/ticket.model";
import { CreateTicketDto } from "./dto.ts/create-ticket.dto";
import { and, eq } from "drizzle-orm";


export class TicketService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private db: Schema,
  ) { }

  async getTicket(): Promise<TicketDto[]> {
    const ticket = await this.db.query.tickets.findMany({
      where: (tickets, { eq }) => eq(tickets.deleted, false),
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
      })
      .returning();
    return created;
  }

  async update(id: string, data: UpdateTicketDto): Promise<TicketDto> {
    const [updated] = await this.db.update(tickets)
      .set({
        name: data.name,
        message: data.message,
        email: data.email,
        phone: data.phone,
        status: data.status,
      })
      .where(and(eq(tickets.id, id), eq(tickets.deleted, false)))
      .returning();
    if (!updated) throw new NotFoundException('Ticket not found');
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const [deleted] = await this.db.update(tickets)
      .set({ deleted: true })
      .where(and(eq(tickets.id, id), eq(tickets.deleted, false)))
      .returning();
    if (!deleted) throw new NotFoundException('Ticket not found');
    return true;
  }
}
