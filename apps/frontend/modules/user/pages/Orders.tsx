import Link from 'next/link';
import UserLayout from "../layouts/UserLayout";
import { OrderDetailsResponseDto, OrderStatus, InvoiceStatus, PaymentMethod, PaymentStatus } from '@/lib/dtos/order';


export const fakeOrders: OrderDetailsResponseDto[] = [

    {
        order: {
            id: "ORD-1001",
            status: OrderStatus.COMPLETED,
            createdAt: new Date("2025-08-21"),
            isDeleted: false,
            customerId: "CUST-1",
            invoices: [
                {
                    id: "INV-2001",
                    orderId: "ORD-1001",
                    amount: "120.00",
                    issuedAt: new Date("2025-08-21"),
                    dueDate: new Date("2025-08-28"),
                    status: InvoiceStatus.PAID,
                },
            ],
            orderProducts: [
                {
                    id: "OP-3001",
                    orderId: "ORD-1001",
                    productId: "PROD-1",
                    quantity: 1,
                    price: "60.00",
                },
                {
                    id: "OP-3002",
                    orderId: "ORD-1001",
                    productId: "PROD-2",
                    quantity: 1,
                    price: "60.00",
                },
            ],
        },
        orderProducts: [
            {
                id: "OP-3001",
                orderId: "ORD-1001",
                productId: "PROD-1",
                quantity: 1,
                price: "60.00",
                product: { id: "PROD-1", name: "T-shirt", price: "60.00" },
            },
            {
                id: "OP-3002",
                orderId: "ORD-1001",
                productId: "PROD-2",
                quantity: 1,
                price: "60.00",
                product: { id: "PROD-2", name: "Jeans", price: "60.00" },
            },
        ],
        invoices: [
            {
                id: "INV-2001",
                orderId: "ORD-1001",
                amount: "120.00",
                issuedAt: new Date("2025-08-21"),
                dueDate: new Date("2025-08-28"),
                status: InvoiceStatus.PAID,
                payments: [
                    {
                        id: "PAY-4001",
                        invoiceId: "INV-2001",
                        amount: "120.00",
                        paidAt: new Date("2025-08-22"),
                        method: PaymentMethod.CARD,
                        status: PaymentStatus.COMPLETED,
                    },
                ],
            },
        ],
    },
    {
        order: {
            id: "ORD-1002",
            status: OrderStatus.PENDING,
            createdAt: new Date("2025-08-18"),
            isDeleted: false,
            customerId: "CUST-2",
            invoices: [
                {
                    id: "INV-2002",
                    orderId: "ORD-1002",
                    amount: "75.50",
                    issuedAt: new Date("2025-08-18"),
                    dueDate: new Date("2025-08-25"),
                    status: InvoiceStatus.UNPAID,
                },
            ],
            orderProducts: [
                {
                    id: "OP-3003",
                    orderId: "ORD-1002",
                    productId: "PROD-3",
                    quantity: 1,
                    price: "75.50",
                },
            ],
        },
        orderProducts: [
            {
                id: "OP-3003",
                orderId: "ORD-1002",
                productId: "PROD-3",
                quantity: 1,
                price: "75.50",
                product: { id: "PROD-3", name: "Dress", price: "75.50" },
            },
        ],
        invoices: [
            {
                id: "INV-2002",
                orderId: "ORD-1002",
                amount: "75.50",
                issuedAt: new Date("2025-08-18"),
                dueDate: new Date("2025-08-25"),
                status: InvoiceStatus.UNPAID,
                payments: [],
            },
        ],
    },
    {
        order: {
            id: "ORD-1003",
            status: OrderStatus.CANCELLED,
            createdAt: new Date("2025-08-10"),
            isDeleted: false,
            customerId: "CUST-3",
            invoices: [
                {
                    id: "INV-2003",
                    orderId: "ORD-1003",
                    amount: "49.99",
                    issuedAt: new Date("2025-08-10"),
                    dueDate: new Date("2025-08-17"),
                    status: InvoiceStatus.CANCELLED,
                },
            ],
            orderProducts: [
                {
                    id: "OP-3004",
                    orderId: "ORD-1003",
                    productId: "PROD-4",
                    quantity: 1,
                    price: "49.99",
                },
            ],
        },
        orderProducts: [
            {
                id: "OP-3004",
                orderId: "ORD-1003",
                productId: "PROD-4",
                quantity: 1,
                price: "49.99",
                product: { id: "PROD-4", name: "Shoes", price: "49.99" },
            },
        ],
        invoices: [
            {
                id: "INV-2003",
                orderId: "ORD-1003",
                amount: "49.99",
                issuedAt: new Date("2025-08-10"),
                dueDate: new Date("2025-08-17"),
                status: InvoiceStatus.CANCELLED,
                payments: [],
            },
        ],
    },
    {
        order: {
            id: "ORD-1004",
            status: OrderStatus.PROCESSING,
            createdAt: new Date("2025-07-30"),
            isDeleted: false,
            customerId: "CUST-4",
            invoices: [
                {
                    id: "INV-2004",
                    orderId: "ORD-1004",
                    amount: "210.00",
                    issuedAt: new Date("2025-07-30"),
                    dueDate: new Date("2025-08-06"),
                    status: InvoiceStatus.PARTIAL,
                },
            ],
            orderProducts: [
                {
                    id: "OP-3005",
                    orderId: "ORD-1004",
                    productId: "PROD-5",
                    quantity: 1,
                    price: "100.00",
                },
                {
                    id: "OP-3006",
                    orderId: "ORD-1004",
                    productId: "PROD-6",
                    quantity: 2,
                    price: "55.00",
                },
            ],
        },
        orderProducts: [
            {
                id: "OP-3005",
                orderId: "ORD-1004",
                productId: "PROD-5",
                quantity: 1,
                price: "100.00",
                product: { id: "PROD-5", name: "Jacket", price: "100.00" },
            },
            {
                id: "OP-3006",
                orderId: "ORD-1004",
                productId: "PROD-6",
                quantity: 2,
                price: "55.00",
                product: { id: "PROD-6", name: "Hat", price: "55.00" },
            },
        ],
        invoices: [
            {
                id: "INV-2004",
                orderId: "ORD-1004",
                amount: "210.00",
                issuedAt: new Date("2025-07-30"),
                dueDate: new Date("2025-08-06"),
                status: InvoiceStatus.PARTIAL,
                payments: [
                    {
                        id: "PAY-4002",
                        invoiceId: "INV-2004",
                        amount: "100.00",
                        paidAt: new Date("2025-07-31"),
                        method: PaymentMethod.CASH,
                        status: PaymentStatus.COMPLETED,
                    },
                    {
                        id: "PAY-4003",
                        invoiceId: "INV-2004",
                        amount: "55.00",
                        paidAt: new Date("2025-08-01"),
                        method: PaymentMethod.BANK_TRANSFER,
                        status: PaymentStatus.PENDING,
                    },
                ],
            },
        ],
    },
];

export const Orders = () => {
    return (
        <UserLayout title="Orders">
            <div className="flex flex-col gap-6">
                {fakeOrders.map(order => (
                    <Link href={`/orders/${order.order.id}`} key={order.order.id} className="border rounded-lg p-6 bg-gray-50 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">{order.order.id}</span>
                            <span className="text-xs text-gray-500">{order.order.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-sm font-semibold">Status: </span>
                            <span className={`text-sm font-bold ${order.order.status === OrderStatus.COMPLETED ? "text-green-600" : order.order.status === OrderStatus.CANCELLED ? "text-red-600" : "text-yellow-600"}`}>{order.order.status}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-sm font-semibold">Total: </span>
                            <span className="text-sm">${order.invoices[0]?.amount ?? "0.00"}</span>
                        </div>
                        <div>
                            <span className="text-sm font-semibold">Items: </span>
                            <span className="text-sm">{order.orderProducts.map(op => op.product?.name).filter(Boolean).join(", ")}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </UserLayout>
    );
};
