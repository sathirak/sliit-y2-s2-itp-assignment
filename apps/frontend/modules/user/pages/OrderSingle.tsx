import UserLayout from '@/modules/user/layouts/UserLayout';
import { OrderDetailsResponseDto, OrderStatus, InvoiceStatus, PaymentMethod, PaymentStatus } from '@/lib/dtos/order';
import { fakeOrders } from '@/modules/user/pages/Orders';


export const OrderSingle = ({ id }: { id: string }) => {
    const order = fakeOrders.find(o => o.order.id === id);
    if (!order) {
        return (
            <UserLayout title={`Order Details - ${id}`}>
                <div className="text-red-600">Order not found.</div>
            </UserLayout>
        );
    }
    return (
        <UserLayout title={`Order Details - ${id}`}>
            <div className="border rounded-xl p-8 bg-white shadow-lg max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
                    <div>
                        <div className="text-2xl font-bold text-gray-800">Order #{order.order.id}</div>
                        <div className="text-sm text-gray-500">Placed on {order.order.createdAt.toLocaleDateString()}</div>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700 mr-2">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.order.status === OrderStatus.COMPLETED ? "bg-green-100 text-green-700" : order.order.status === OrderStatus.CANCELLED ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{order.order.status}</span>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="mb-6">
                    <div className="font-semibold text-gray-700">Customer ID:</div>
                    <div className="text-gray-800">{order.order.customerId}</div>
                </div>

                {/* Products Section */}
                <div className="mb-8">
                    <div className="font-semibold text-gray-700 mb-2">Products</div>
                    <table className="w-full text-sm border rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-3 text-left">Product</th>
                                <th className="py-2 px-3 text-left">Quantity</th>
                                <th className="py-2 px-3 text-left">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderProducts.map(op => (
                                <tr key={op.id} className="border-t">
                                    <td className="py-2 px-3">{op.product?.name}</td>
                                    <td className="py-2 px-3">{op.quantity}</td>
                                    <td className="py-2 px-3">${op.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Invoices Section */}
                <div className="mb-4">
                    <div className="font-semibold text-gray-700 mb-2">Invoices</div>
                    {order.invoices.map(inv => (
                        <div key={inv.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-bold">Invoice #{inv.id}</div>
                                <div className={`px-2 py-1 rounded text-xs font-bold ${inv.status === InvoiceStatus.PAID ? "bg-green-100 text-green-700" : inv.status === InvoiceStatus.CANCELLED ? "bg-red-100 text-red-700" : inv.status === InvoiceStatus.OVERDUE ? "bg-yellow-100 text-yellow-700" : "bg-gray-200 text-gray-700"}`}>{inv.status}</div>
                            </div>
                            <div className="mb-1 text-sm">Amount: <span className="font-semibold">${inv.amount}</span></div>
                            <div className="mb-1 text-sm">Issued: {inv.issuedAt.toLocaleDateString()}</div>
                            {inv.dueDate && <div className="mb-1 text-sm">Due: {inv.dueDate.toLocaleDateString()}</div>}
                            {inv.payments && inv.payments.length > 0 && (
                                <div className="mt-2">
                                    <div className="font-semibold text-gray-700 mb-1">Payments</div>
                                    <table className="w-full text-xs border rounded-lg overflow-hidden">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="py-1 px-2 text-left">Payment ID</th>
                                                <th className="py-1 px-2 text-left">Amount</th>
                                                <th className="py-1 px-2 text-left">Method</th>
                                                <th className="py-1 px-2 text-left">Status</th>
                                                <th className="py-1 px-2 text-left">Paid At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inv.payments.map(pay => (
                                                <tr key={pay.id} className="border-t">
                                                    <td className="py-1 px-2">{pay.id}</td>
                                                    <td className="py-1 px-2">${pay.amount}</td>
                                                    <td className="py-1 px-2">{pay.method}</td>
                                                    <td className={`py-1 px-2 font-bold ${pay.status === PaymentStatus.COMPLETED ? "text-green-600" : pay.status === PaymentStatus.FAILED ? "text-red-600" : "text-yellow-600"}`}>{pay.status}</td>
                                                    <td className="py-1 px-2">{pay.paidAt ? new Date(pay.paidAt).toLocaleDateString() : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </UserLayout>
    );
};
