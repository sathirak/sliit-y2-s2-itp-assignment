import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvoiceDto } from './dtos/invoice.dto';
import { InvoiceWithRelationsDto } from './dtos/invoice-with-relations.dto';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { InvoiceService } from './invoice.service';
import { InvoiceStatus } from './interfaces/invoice-status';

@Controller('invoices')
@ApiTags('Invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async getAll(): Promise<InvoiceWithRelationsDto[]> {
    return this.invoiceService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<InvoiceWithRelationsDto> {
    const invoice = await this.invoiceService.getById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  @Get('order/:orderId')
  async getByOrderId(@Param('orderId') orderId: string): Promise<InvoiceWithRelationsDto[]> {
    return this.invoiceService.getByOrderId(orderId);
  }

  @Get('customer/:customerId')
  async getByCustomerId(@Param('customerId') customerId: string): Promise<InvoiceWithRelationsDto[]> {
    return this.invoiceService.getByCustomerId(customerId);
  }

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<InvoiceDto> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: InvoiceStatus,
  ): Promise<InvoiceDto> {
    const invoice = await this.invoiceService.updateStatus(id, status);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }
}
