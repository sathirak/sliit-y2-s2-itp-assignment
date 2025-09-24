import useSWR, { mutate } from 'swr';
import {
  getAllInvoices,
  getInvoiceById,
  getInvoicesByOrderId,
  getInvoicesByCustomerId,
  createInvoice,
  updateInvoiceStatus,
} from '@/lib/services/order';
import type {
  InvoiceDto,
  InvoiceWithRelationsDto,
  CreateInvoiceDto,
  InvoiceStatus,
} from '@/lib/dtos/order';

// SWR Keys
const INVOICES_KEY = 'invoices';
const INVOICE_KEY = (id: string) => `invoices/${id}`;
const INVOICES_BY_ORDER_KEY = (orderId: string) => `invoices/order/${orderId}`;
const INVOICES_BY_CUSTOMER_KEY = (customerId: string) => `invoices/customer/${customerId}`;

// Invoices Hooks
export function useInvoices() {
  const { data, error, isLoading } = useSWR(INVOICES_KEY, getAllInvoices);
  return {
    invoices: data || [],
    isLoading,
    isError: !!error,
  };
}

export function useInvoice(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? INVOICE_KEY(id) : null,
    () => getInvoiceById(id)
  );
  return {
    invoice: data,
    isLoading,
    isError: !!error,
  };
}

export function useInvoicesByOrder(orderId: string) {
  const { data, error, isLoading } = useSWR(
    orderId ? INVOICES_BY_ORDER_KEY(orderId) : null,
    () => getInvoicesByOrderId(orderId)
  );
  return {
    invoices: data || [],
    isLoading,
    isError: !!error,
  };
}

export function useInvoicesByCustomer(customerId: string) {
  const { data, error, isLoading } = useSWR(
    customerId ? INVOICES_BY_CUSTOMER_KEY(customerId) : null,
    () => getInvoicesByCustomerId(customerId)
  );
  return {
    invoices: data || [],
    isLoading,
    isError: !!error,
  };
}

// Invoice Mutations
export function useInvoiceMutations() {
  const createInvoiceMutation = async (data: CreateInvoiceDto) => {
    const newInvoice = await createInvoice(data);
    // Update invoices list cache
    mutate(INVOICES_KEY, (invoices: InvoiceWithRelationsDto[] = []) => [newInvoice as InvoiceWithRelationsDto, ...invoices], false);
    mutate(INVOICES_KEY); // Revalidate
    
    // Update related caches
    if (data.orderId) {
      mutate(INVOICES_BY_ORDER_KEY(data.orderId));
    }
    
    return newInvoice;
  };

  const updateInvoiceStatusMutation = async (id: string, status: InvoiceStatus) => {
    const updatedInvoice = await updateInvoiceStatus(id, status);
    
    // Update individual invoice cache
    mutate(INVOICE_KEY(id), (current: InvoiceWithRelationsDto | undefined) => 
      current ? { ...current, status } : current, false);
    
    // Update invoices list cache
    mutate(INVOICES_KEY, (invoices: InvoiceWithRelationsDto[] = []) => 
      invoices.map(invoice => invoice.id === id ? { ...invoice, status } : invoice), false);
    
    // Revalidate all related caches
    mutate(INVOICES_KEY);
    mutate(INVOICE_KEY(id));
    
    return updatedInvoice;
  };

  return {
    createInvoice: createInvoiceMutation,
    updateInvoiceStatus: updateInvoiceStatusMutation,
  };
}