import useSWR, { mutate } from 'swr';
import {
  getAllPayments,
  getPaymentById,
  getPaymentsByInvoiceId,
  getPaymentsByCustomerId,
  makePayment,
} from '@/lib/services/order';
import type {
  PaymentDto,
  PaymentWithRelationsDto,
  CreatePaymentDto,
} from '@/lib/dtos/order';

// SWR Keys
const PAYMENTS_KEY = 'payments';
const PAYMENT_KEY = (id: string) => `payments/${id}`;
const PAYMENTS_BY_INVOICE_KEY = (invoiceId: string) => `payments/invoice/${invoiceId}`;
const PAYMENTS_BY_CUSTOMER_KEY = (customerId: string) => `payments/customer/${customerId}`;

// Payments Hooks
export function usePayments() {
  const { data, error, isLoading } = useSWR(PAYMENTS_KEY, getAllPayments);
  return {
    payments: data || [],
    isLoading,
    isError: !!error,
  };
}

export function usePayment(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? PAYMENT_KEY(id) : null,
    () => getPaymentById(id)
  );
  return {
    payment: data,
    isLoading,
    isError: !!error,
  };
}

export function usePaymentsByInvoice(invoiceId: string) {
  const { data, error, isLoading } = useSWR(
    invoiceId ? PAYMENTS_BY_INVOICE_KEY(invoiceId) : null,
    () => getPaymentsByInvoiceId(invoiceId)
  );
  return {
    payments: data || [],
    isLoading,
    isError: !!error,
  };
}

export function usePaymentsByCustomer(customerId: string) {
  const { data, error, isLoading } = useSWR(
    customerId ? PAYMENTS_BY_CUSTOMER_KEY(customerId) : null,
    () => getPaymentsByCustomerId(customerId)
  );
  return {
    payments: data || [],
    isLoading,
    isError: !!error,
  };
}

// Payment Mutations
export function usePaymentMutations() {
  const makePaymentMutation = async (data: CreatePaymentDto) => {
    const newPayment = await makePayment(data);
    
    // Update payments list cache
    mutate(PAYMENTS_KEY, (payments: PaymentWithRelationsDto[] = []) => [newPayment as PaymentWithRelationsDto, ...payments], false);
    mutate(PAYMENTS_KEY); // Revalidate
    
    // Update related caches
    if (data.invoiceId) {
      mutate(PAYMENTS_BY_INVOICE_KEY(data.invoiceId));
    }
    
    return newPayment;
  };

  return {
    makePayment: makePaymentMutation,
  };
}