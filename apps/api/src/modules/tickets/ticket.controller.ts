import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException, Query } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketDto } from './dto.ts/ticket.dto';
import { CreateTicketDto } from './dto.ts/create-ticket.dto';
import { UpdateTicketDto } from './dto.ts/update-ticket.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { AllowGuests } from 'src/common/decorates/allow-guests.decorator';

@Controller('ticket')
@ApiTags('Ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false, description: 'Filter by ticket status' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, email, or message' })
  async getAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<TicketDto[]> {
    return this.ticketService.getTicket(status, search);
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
  @AllowGuests()
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
