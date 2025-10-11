'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/modules/ui/card";
import { useTickets } from "@/lib/hooks/useTickets";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TicketStatus } from "@/lib/dtos/ticket";

export function TicketChart() {
  const { tickets, isLoading } = useTickets({ status: TicketStatus.CLOSED });

  // Process tickets to group by date
  const processedData = tickets.reduce((acc, ticket) => {
    // Ensure ticket.createdAt is properly parsed as a Date
    const ticketDate = typeof ticket.createdAt === 'string' ? new Date(ticket.createdAt) : ticket.createdAt;
    const date = ticketDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data format
  const chartData = Object.entries(processedData).map(([date, count]) => ({
    date,
    count,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Support Ticket Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            Loading ticket data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Support Ticket Trends</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {tickets.length} closed tickets over time
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No ticket data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}