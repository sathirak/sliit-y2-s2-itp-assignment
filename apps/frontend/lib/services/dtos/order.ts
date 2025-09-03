// Order Status Enum
export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

// Invoice Status Enum
export enum InvoiceStatus {
    UNPAID = 'unpaid',
    PAID = 'paid',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled',
    PARTIAL = 'partial',
}

// Payment Method Enum
export enum PaymentMethod {
    CARD = 'card',
    CASH = 'cash',
    BANK_TRANSFER = 'bank_transfer',
    DIGITAL_WALLET = 'digital_wallet',
    CHECK = 'check',
    CREDIT = 'credit',
}

// Payment Status Enum
export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
    PROCESSING = 'processing',
}

// Basic Product Interface
export interface BasicProductDto {
    id: string;
    name?: string;
    description?: string;
    price?: string;
}

// Order DTO Interface
export interface OrderDto {
    id: string;
    status: OrderStatus;
    createdAt: Date;
    isDeleted: boolean;
    customerId?: string;
}

// Order Product DTO Interface
export interface OrderProductDto {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: string;
}

// Invoice DTO Interface
export interface InvoiceDto {
    id: string;
    orderId: string;
    amount: string;
    issuedAt: Date;
    dueDate?: Date;
    status: InvoiceStatus;
}

// Payment DTO Interface
export interface PaymentDto {
    id: string;
    invoiceId: string;
    amount: string;
    paidAt: Date;
    method: PaymentMethod;
    status: PaymentStatus;
}

// Order with Relations Interface
export interface OrderWithRelationsDto {
    id: string;
    status: OrderStatus;
    createdAt: Date;
    isDeleted: boolean;
    customerId?: string;
    invoices?: InvoiceDto[];
    orderProducts?: OrderProductDto[];
}

// Order Product with Relations Interface
export interface OrderProductWithRelationsDto {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: string;
    order?: OrderDto;
    product?: BasicProductDto;
}

// Invoice with Relations Interface
export interface InvoiceWithRelationsDto {
    id: string;
    orderId: string;
    amount: string;
    issuedAt: Date;
    dueDate?: Date;
    status: InvoiceStatus;
    order?: OrderDto;
    payments?: PaymentDto[];
}

// Order Details Response Interface
export interface OrderDetailsResponseDto {
    order: OrderWithRelationsDto;
    orderProducts: OrderProductWithRelationsDto[];
    invoices: InvoiceWithRelationsDto[];
}
