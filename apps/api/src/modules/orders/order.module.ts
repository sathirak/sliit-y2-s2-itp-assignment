import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [DatabaseModule],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
