import { apiPrivateClient } from "@/lib/api/private";
import { apiPublicClient } from "@/lib/api";
import type {
  OrderDto,
  OrderWithRelationsDto,
  CreateOrderDto,
  UpdateOrderDto,
  CheckoutDto,
  CheckoutResponseDto,
  OrderDetailsResponseDto,
  InvoiceDto,
  InvoiceWithRelationsDto,
  CreateInvoiceDto,
  PaymentDto,
  PaymentWithRelationsDto,
  CreatePaymentDto,
  InvoiceStatus,
  PaymentStatus,
} from '@/lib/dtos/order';

// Checkout Service Functions
export const processCheckout = async (checkoutDto: CheckoutDto): Promise<CheckoutResponseDto> => {
  const result = await apiPublicClient
    .post<CheckoutResponseDto>("checkout", { json: checkoutDto })
    .json();
  return result;
};

export const getCustomerOrders = async (customerId: string): Promise<OrderDto[]> => {
  const result = await apiPublicClient
    .get<OrderDto[]>(`checkout/customer/${customerId}/orders`)
    .json();
  return result;
};

export const getOrderDetails = async (orderId: string): Promise<OrderDetailsResponseDto> => {
  const result = await apiPublicClient
    .get<OrderDetailsResponseDto>(`checkout/order/${orderId}/details`)
    .json();
  return result;
};

// Order Service Functions
export const getAllOrders = async (): Promise<OrderDto[]> => {
  const result = await apiPrivateClient
    .get<OrderDto[]>("order")
    .json();
  return result;
};

export const getOrderById = async (id: string): Promise<OrderDto> => {
  const result = await apiPrivateClient
    .get<OrderDto>(`order/${id}`)
    .json();
  return result;
};

export const createOrder = async (createOrderDto: CreateOrderDto): Promise<OrderDto> => {
  const result = await apiPrivateClient
    .post<OrderDto>("order", { json: createOrderDto })
    .json();
  return result;
};

export const updateOrder = async (id: string, updateOrderDto: UpdateOrderDto): Promise<OrderDto> => {
  const result = await apiPrivateClient
    .put<OrderDto>(`order/${id}`, { json: updateOrderDto })
    .json();
  return result;
};

export const deleteOrder = async (id: string): Promise<{ message: string }> => {
  const result = await apiPrivateClient
    .delete<{ message: string }>(`order/${id}`)
    .json();
  return result;
};

// Invoice Service Functions
export const getAllInvoices = async (): Promise<InvoiceWithRelationsDto[]> => {
  const result = await apiPrivateClient
    .get<InvoiceWithRelationsDto[]>("invoices")
    .json();
  return result;
};

export const getInvoiceById = async (id: string): Promise<InvoiceWithRelationsDto> => {
  const result = await apiPrivateClient
    .get<InvoiceWithRelationsDto>(`invoices/${id}`)
    .json();
  return result;
};

export const getInvoicesByOrderId = async (orderId: string): Promise<InvoiceWithRelationsDto[]> => {
  const result = await apiPrivateClient
    .get<InvoiceWithRelationsDto[]>(`invoices/order/${orderId}`)
    .json();
  return result;
};

export const getInvoicesByCustomerId = async (customerId: string): Promise<InvoiceWithRelationsDto[]> => {
  const result = await apiPrivateClient
    .get<InvoiceWithRelationsDto[]>(`invoices/customer/${customerId}`)
    .json();
  return result;
};

export const createInvoice = async (createInvoiceDto: CreateInvoiceDto): Promise<InvoiceDto> => {
  const result = await apiPrivateClient
    .post<InvoiceDto>("invoices", { json: createInvoiceDto })
    .json();
  return result;
};

export const updateInvoiceStatus = async (id: string, status: InvoiceStatus): Promise<InvoiceDto> => {
  const result = await apiPrivateClient
    .put<InvoiceDto>(`invoices/${id}/status`, { json: { status } })
    .json();
  return result;
};

// Payment Service Functions
export const getAllPayments = async (): Promise<PaymentWithRelationsDto[]> => {
  const result = await apiPrivateClient
    .get<PaymentWithRelationsDto[]>("payments")
    .json();
  return result;
};

export const getPaymentById = async (id: string): Promise<PaymentWithRelationsDto> => {
  const result = await apiPrivateClient
    .get<PaymentWithRelationsDto>(`payments/${id}`)
    .json();
  return result;
};

export const getPaymentsByInvoiceId = async (invoiceId: string): Promise<PaymentWithRelationsDto[]> => {
  const result = await apiPrivateClient
    .get<PaymentWithRelationsDto[]>(`payments/invoice/${invoiceId}`)
    .json();
  return result;
};

export const getPaymentsByCustomerId = async (customerId: string): Promise<PaymentWithRelationsDto[]> => {
  const result = await apiPrivateClient
    .get<PaymentWithRelationsDto[]>(`payments/customer/${customerId}`)
    .json();
  return result;
};

export const makePayment = async (createPaymentDto: CreatePaymentDto): Promise<PaymentDto> => {
  const result = await apiPrivateClient
    .post<PaymentDto>("payments", { json: createPaymentDto })
    .json();
  return result;
};