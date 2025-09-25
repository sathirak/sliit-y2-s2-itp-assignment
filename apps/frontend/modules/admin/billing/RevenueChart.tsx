'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/modules/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/modules/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { usePayments } from '@/lib/hooks/usePayments';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--primary))',
  },
};

export function RevenueChart() {
  const { payments, isLoading, isError } = usePayments();

  // Process payment data to create revenue chart data
  const revenueData = useMemo(() => {
    if (!payments || payments.length === 0) return [];

    // Filter successful payments and group by date
    const successfulPayments = payments.filter(
      (payment) => payment.status === 'completed'
    );

    // Get current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter payments from current month
    const currentMonthPayments = successfulPayments.filter((payment) => {
      const paymentDate = new Date(payment.paidAt);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    });

    // Group payments by date and sum amounts
    const dailyRevenue = currentMonthPayments.reduce((acc, payment) => {
        const date = new Date(payment.paidAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const amount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount;
      
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by date
    return Object.entries(dailyRevenue)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date + `, ${currentYear}`).getTime() - new Date(b.date + `, ${currentYear}`).getTime());
  }, [payments]);

  // Calculate total revenue and growth percentage
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;
  const latestRevenue = revenueData[revenueData.length - 1]?.revenue || 0;
  const growthPercentage = averageRevenue > 0 ? ((latestRevenue - averageRevenue) / averageRevenue * 100) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Revenue Overview
            <TrendingUp className="ml-2 h-4 w-4" />
          </CardTitle>
          <CardDescription>Loading revenue data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Revenue Overview
            <TrendingUp className="ml-2 h-4 w-4" />
          </CardTitle>
          <CardDescription>Error loading revenue data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-red-500">Failed to load chart data</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (revenueData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Revenue Overview
            <TrendingUp className="ml-2 h-4 w-4" />
          </CardTitle>
          <CardDescription>No revenue data available for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">No successful payments this month</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Revenue Overview
          <TrendingUp className="ml-2 h-4 w-4" />
        </CardTitle>
        <CardDescription>
          Revenue from successful payments this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-baseline space-x-2">
          <div className="text-3xl font-bold">
            Rs {totalRevenue.toLocaleString()}
          </div>
          <div className={`text-sm font-medium ${growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growthPercentage >= 0 ? '+' : ''}
            {growthPercentage.toFixed(1)}% from average
          </div>
        </div>
        
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart
            data={revenueData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs"
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={{
                fill: 'hsl(var(--primary))',
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ChartContainer>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Data represents daily revenue from successful payments in the current month
        </div>
      </CardContent>
    </Card>
  );
}