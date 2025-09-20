import { tickets } from 'src/modules/tickets/models/ticket.model';
import { usersTable, usersRelations } from 'src/modules/users/models/user.model';
import { orders, ordersRelations } from 'src/modules/orders/models/order.model';
import { invoices, invoicesRelations } from 'src/modules/orders/models/invoice.model';
import { orderProducts, orderProductsRelations } from 'src/modules/orders/models/order-product.model';
import { payments, paymentsRelations } from 'src/modules/orders/models/payment.model';
import { products } from 'src/modules/products/models/product.model';
import { contracts } from 'src/modules/contracts/models/contract.model';
import { contractRequests } from 'src/modules/contracts/models/contract-request.model';
import { contractRequestComments } from 'src/modules/contracts/models/contract-request-comment.model';
import { userProviders, userProvidersRelations } from 'src/modules/users/models/user-providers.model';

export { 
    usersTable, 
    usersRelations,
    tickets, 
    orders, 
    ordersRelations,
    invoices,
    invoicesRelations,
    orderProducts,
    orderProductsRelations,
    payments,
    paymentsRelations,
    products, 
    contracts, 
    contractRequests, 
    contractRequestComments,
    userProviders, 
    userProvidersRelations
};