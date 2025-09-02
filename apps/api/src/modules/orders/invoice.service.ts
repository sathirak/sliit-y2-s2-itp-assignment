import { Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { invoices } from './models/invoice.model';
import { InvoiceDto } from './dtos/invoice.dto';
import { InvoiceWithRelationsDto } from './dtos/invoice-with-relations.dto';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { InvoiceStatus } from './interfaces/invoice-status';

@Injectable()
export class InvoiceService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private readonly db: Schema,
  ) {}

  async getAll(): Promise<InvoiceWithRelationsDto[]> {
    const invoiceList = await this.db.query.invoices.findMany({
      with: {
        order: true,
        payments: true,
      },
    });
    return invoiceList;
  }

  async getById(id: string): Promise<InvoiceWithRelationsDto> {
    const invoice = await this.db.query.invoices.findFirst({
      where: (invoices, { eq }) => eq(invoices.id, id),
      with: {
        order: true,
        payments: true,
      },
    });
    return invoice;
  }

  async getByOrderId(orderId: string): Promise<InvoiceWithRelationsDto[]> {
    const invoiceList = await this.db.query.invoices.findMany({
      where: (invoices, { eq }) => eq(invoices.orderId, orderId),
      with: {
        order: true,
        payments: true,
      },
    });
    return invoiceList;
  }

  async getByCustomerId(customerId: string): Promise<InvoiceWithRelationsDto[]> {
    const invoiceList = await this.db.query.invoices.findMany({
      with: {
        order: true,
        payments: true,
      },
    });
    return invoiceList.filter(invoice => invoice.order && invoice.order.customerId === customerId);
  }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceDto> {
    const [newInvoice] = await this.db
      .insert(invoices)
      .values({
        orderId: createInvoiceDto.orderId,
        amount: createInvoiceDto.amount,
        dueDate: createInvoiceDto.dueDate,
        status: createInvoiceDto.status,
      })
      .returning();
    return newInvoice;
  }

  async updateStatus(id: string, status: InvoiceStatus): Promise<InvoiceDto> {
    const [updatedInvoice] = await this.db
      .update(invoices)
      .set({ status })
      .where(eq(invoices.id, id))
      .returning();
    return updatedInvoice;
  }
}
