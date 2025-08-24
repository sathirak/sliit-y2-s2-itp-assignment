import { Inject } from "@nestjs/common";
import type { Schema } from "src/common/types/db";
import { DatabaseAsyncProvider } from "src/database/database.provider";
import { TicketDto } from "./dto.ts/ticket.dto";


export class TicketService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private db: Schema,
  ) {}

  async getTicket(): Promise <TicketDto[]> {
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
}
