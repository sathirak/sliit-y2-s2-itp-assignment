'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/modules/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/modules/ui/tabs';
import { Button } from '@/modules/ui/button';
import { Badge } from '@/modules/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw,
  ShoppingCart,
  FileText,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Input } from '@/modules/ui/input';
import { OrdersTable } from '@/modules/admin/billing/OrdersTable';
import { InvoicesTable } from '@/modules/admin/billing/InvoicesTable';
import { OrderDialog } from '@/modules/admin/billing/OrderDialog';
import { useOrders } from '@/lib/hooks/useOrders';
import { useInvoices } from '@/lib/hooks/useInvoices';
import { usePayments } from '@/lib/hooks/usePayments';
import { PaymentDialog } from '@/modules/admin/billing/PaymentDialog';
import { InvoiceDialog } from '@/modules/admin/billing/InvoiceDialog';
import { PaymentsTable } from '@/modules/admin/billing/PaymentsTable';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'invoices' | 'payments'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const { orders, isLoading: ordersLoading } = useOrders();
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { payments, isLoading: paymentsLoading } = usePayments();

  // Calculate statistics
  const totalOrders = orders.length;
  const totalInvoices = invoices.length;
  const totalPayments = payments.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const unpaidInvoices = invoices.filter(invoice => invoice.status === 'unpaid').length;
  const completedPayments = payments.filter(payment => payment.status === 'completed').length;

  // Calculate total revenue from completed payments
  const totalRevenue = payments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  const handleRefresh = () => {
    window.location.reload();
  };

  const getTabButtonText = (tab: string, count: number) => {
    switch (tab) {
      case 'orders':
        return `Orders (${count})`;
      case 'invoices':
        return `Invoices (${count})`;
      case 'payments':
        return `Payments (${count})`;
      default:
        return tab;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing Management</h1>
          <p className="text-muted-foreground">
            Manage orders, invoices, and payments for your store
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant={pendingOrders > 0 ? "destructive" : "secondary"} className="text-xs">
                {pendingOrders} pending
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant={unpaidInvoices > 0 ? "destructive" : "secondary"} className="text-xs">
                {unpaidInvoices} unpaid
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="default" className="text-xs">
                {completedPayments} completed
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From completed payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Billing Operations</CardTitle>
              <CardDescription>View and manage orders, invoices, and payments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="orders">
                  {getTabButtonText('orders', totalOrders)}
                </TabsTrigger>
                <TabsTrigger value="invoices">
                  {getTabButtonText('invoices', totalInvoices)}
                </TabsTrigger>
                <TabsTrigger value="payments">
                  {getTabButtonText('payments', totalPayments)}
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                
                {activeTab === 'orders' && (
                  <Button onClick={() => setIsOrderDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Order
                  </Button>
                )}
                {activeTab === 'invoices' && (
                  <Button onClick={() => setIsInvoiceDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                )}
                {activeTab === 'payments' && (
                  <Button onClick={() => setIsPaymentDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Record Payment
                  </Button>
                )}
              </div>
            </div>

            <TabsContent value="orders" className="space-y-4">
              <OrdersTable 
                orders={orders} 
                isLoading={ordersLoading} 
                searchTerm={searchTerm}
              />
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4">
              <InvoicesTable 
                invoices={invoices} 
                isLoading={invoicesLoading} 
                searchTerm={searchTerm}
              />
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <PaymentsTable 
                payments={payments} 
                isLoading={paymentsLoading} 
                searchTerm={searchTerm}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <OrderDialog 
        open={isOrderDialogOpen} 
        onOpenChange={setIsOrderDialogOpen}
      />
      <InvoiceDialog 
        open={isInvoiceDialogOpen} 
        onOpenChange={setIsInvoiceDialogOpen}
        orders={orders}
      />
      <PaymentDialog 
        open={isPaymentDialogOpen} 
        onOpenChange={setIsPaymentDialogOpen}
        invoices={invoices}
      />
    </div>
  );
}