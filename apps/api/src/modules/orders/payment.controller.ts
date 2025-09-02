import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentDto } from './dtos/payment.dto';
import { PaymentWithRelationsDto } from './dtos/payment-with-relations.dto';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PaymentService } from './payment.service';
import { InvoiceService } from './invoice.service';
import { InvoiceStatus } from './interfaces/invoice-status';
import { PaymentStatus } from './interfaces/payment-status';

@Controller('payments')
@ApiTags('Payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Get()
  async getAll(): Promise<PaymentWithRelationsDto[]> {
    return this.paymentService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<PaymentWithRelationsDto> {
    const payment = await this.paymentService.getById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  @Get('invoice/:invoiceId')
  async getByInvoiceId(@Param('invoiceId') invoiceId: string): Promise<PaymentWithRelationsDto[]> {
    return this.paymentService.getByInvoiceId(invoiceId);
  }

  @Get('customer/:customerId')
  async getByCustomerId(@Param('customerId') customerId: string): Promise<PaymentWithRelationsDto[]> {
    return this.paymentService.getByCustomerId(customerId);
  }

  @Post()
  async makePayment(@Body() createPaymentDto: CreatePaymentDto): Promise<PaymentDto> {
    // Create the payment
    const payment = await this.paymentService.create(createPaymentDto);

    // Update invoice status if payment is completed
    if (payment.status === PaymentStatus.COMPLETED) {
      await this.invoiceService.updateStatus(payment.invoiceId, InvoiceStatus.PAID);
    }

    return payment;
  }
}
