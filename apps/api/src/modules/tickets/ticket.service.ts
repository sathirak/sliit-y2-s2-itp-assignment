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
      where: (tickets, { eq }) => eq(tickets.isDeleted, false),
    });

    return ticket;
  }

  async getTicketById(ticketId: string): Promise<TicketDto> {
    const ticket = await this.db.query.tickets.findFirst({
      where: (tickets, { eq, and }) =>
        and(eq(tickets.id, ticketId), eq(tickets.isDeleted, false)),
    });

    return ticket;
  }
  
  async create(data: CreateTicketDto): Promise<TicketDto> {
    const [created] = await this.db.insert(tickets)
      .values({
        title: data.title,
        description: data.description,
      })
      .returning();
    return created;
  }

  async delete(id: string): Promise<boolean> {
    const [deleted] = await this.db.update(tickets)
      .set({ isDeleted: true })
      .where(and(eq(tickets.id, id), eq(tickets.isDeleted, false)))
      .returning();
    if (!deleted) throw new NotFoundException('Cat not found');
    return true;
  }
}
