import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}