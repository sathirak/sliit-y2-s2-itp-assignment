import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketDto } from './dto.ts/ticket.dto';
import { CreateTicketDto } from './dto.ts/create-ticket.dto';
import { UpdateTicketDto } from './dto.ts/update-ticket.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('ticket')
@ApiTags('Ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async getAll(): Promise<TicketDto[]> {
    return this.ticketService.getTicket();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<TicketDto> {
    const ticket = await this.ticketService.getTicketById(id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  @Post()
  async create(@Body() data: CreateTicketDto): Promise<TicketDto> {
    return this.ticketService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTicketDto): Promise<TicketDto> {
    return this.ticketService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    const result = await this.ticketService.delete(id);
    return { success: result };
  }
}
