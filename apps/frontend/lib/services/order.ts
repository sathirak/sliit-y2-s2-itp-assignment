import { apiPrivateClient } from "@/lib/private";
import { apiPublicClient } from "@/lib/public";
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
  OrderProductDto,
  CreateOrderProductDto,
  UpdateOrderProductDto,
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
  const result = await apiPrivateClient
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

// Order Product Service Functions
export const getAllOrderProducts = async (): Promise<OrderProductDto[]> => {
  const result = await apiPrivateClient
    .get<OrderProductDto[]>("order-product")
    .json();
  return result;
};

export const getOrderProductById = async (id: string): Promise<OrderProductDto> => {
  const result = await apiPrivateClient
    .get<OrderProductDto>(`order-product/${id}`)
    .json();
  return result;
};

export const getOrderProductsByOrderId = async (orderId: string): Promise<OrderProductDto[]> => {
  const result = await apiPrivateClient
    .get<OrderProductDto[]>(`order-product/order/${orderId}`)
    .json();
  return result;
};

export const createOrderProduct = async (createOrderProductDto: CreateOrderProductDto): Promise<OrderProductDto> => {
  const result = await apiPrivateClient
    .post<OrderProductDto>("order-product", { json: createOrderProductDto })
    .json();
  return result;
};

export const createMultipleOrderProducts = async (createOrderProductDtos: CreateOrderProductDto[]): Promise<OrderProductDto[]> => {
  const result = await apiPrivateClient
    .post<OrderProductDto[]>("order-product/bulk", { json: createOrderProductDtos })
    .json();
  return result;
};

export const updateOrderProduct = async (id: string, updateOrderProductDto: UpdateOrderProductDto): Promise<OrderProductDto> => {
  const result = await apiPrivateClient
    .put<OrderProductDto>(`order-product/${id}`, { json: updateOrderProductDto })
    .json();
  return result;
};

export const deleteOrderProduct = async (id: string): Promise<{ message: string }> => {
  const result = await apiPrivateClient
    .delete<{ message: string }>(`order-product/${id}`)
    .json();
  return result;
};

export const deleteOrderProductsByOrderId = async (orderId: string): Promise<{ message: string }> => {
  const result = await apiPrivateClient
    .delete<{ message: string }>(`order-product/order/${orderId}`)
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