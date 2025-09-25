import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderProductController } from './order-product.controller';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { OrderProductService } from './order-product.service';

@Module({
    imports: [DatabaseModule],
    controllers: [
        OrderController,
        OrderProductController,
        InvoiceController,
        PaymentController,
        CheckoutController,
    ],
    providers: [
        OrderService,
        InvoiceService,
        PaymentService,
        CheckoutService,
        OrderProductService,
    ],
    exports: [
        OrderService,
        InvoiceService,
        PaymentService,
        CheckoutService,
        OrderProductService,
    ],
})
export class OrderModule {}
