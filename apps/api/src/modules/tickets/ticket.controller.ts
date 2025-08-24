import { from } from "rxjs";

import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { TicketService } from "./ticket.service";
import { ApiTags } from "@nestjs/swagger";

@Controller('ticket')
@ApiTags('Ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async getAll() {
    return this.ticketService.getTicket();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const ticket = await this.ticketService.getTicketById(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }
}
