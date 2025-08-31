import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { payments } from './models/payment.model';
import { PaymentDto } from './dtos/payment.dto';
import { PaymentWithRelationsDto } from './dtos/payment-with-relations.dto';
import { CreatePaymentDto } from './dtos/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private readonly db: Schema,
  ) {}

  async getAll(): Promise<PaymentWithRelationsDto[]> {
    const paymentList = await this.db.query.payments.findMany({
      with: {
        invoice: {
          with: {
            order: true,
          },
        },
      },
    });
    return paymentList;
  }

  async getById(id: string): Promise<PaymentWithRelationsDto> {
    const payment = await this.db.query.payments.findFirst({
      where: (payments, { eq }) => eq(payments.id, id),
      with: {
        invoice: {
          with: {
            order: true,
          },
        },
      },
    });
    return payment;
  }

  async getByInvoiceId(invoiceId: string): Promise<PaymentWithRelationsDto[]> {
    const paymentList = await this.db.query.payments.findMany({
      where: (payments, { eq }) => eq(payments.invoiceId, invoiceId),
      with: {
        invoice: {
          with: {
            order: true,
          },
        },
      },
    });
    return paymentList;
  }

  async getByCustomerId(customerId: string): Promise<PaymentWithRelationsDto[]> {
    const paymentList = await this.db.query.payments.findMany({
      with: {
        invoice: {
          with: {
            order: true,
          },
        },
      },
    });
    return paymentList.filter(payment => 
      payment.invoice && 
      payment.invoice.order && 
      payment.invoice.order.customerId === customerId
    );
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentDto> {
    const [newPayment] = await this.db
      .insert(payments)
      .values({
        invoiceId: createPaymentDto.invoiceId,
        amount: createPaymentDto.amount,
        method: createPaymentDto.method,
        status: createPaymentDto.status,
      })
      .returning();
    return newPayment;
  }
}
