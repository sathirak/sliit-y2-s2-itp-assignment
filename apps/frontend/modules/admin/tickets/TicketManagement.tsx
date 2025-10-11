"use client";

import { useState, useEffect } from "react";
import { Ticket, TicketStatus, TicketFilterDto } from "@/lib/dtos/ticket";
import { useTickets, useTicketMutations } from "@/lib/hooks/useTickets";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/ui/tabs";
import { Badge } from "@/modules/ui/badge";
import { MessageSquare, Plus, Search, Edit, Trash2 } from "lucide-react";
import { TicketDialog } from '@/modules/admin/tickets/components/TicketDialog';

export function TicketManagement() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create filters based on active tab and search
  const filters: TicketFilterDto = {
    ...(activeTab !== "all" && { status: activeTab as TicketStatus }),
    ...(search.trim() && { search: search.trim() }),
  };

  const { tickets, isLoading, isError, error: swrError } = useTickets(filters);
  const { updateTicket, deleteTicket } = useTicketMutations();

  // Count tickets by status for tab badges
  const { tickets: allTickets } = useTickets();
  const statusCounts = {
    all: allTickets.length,
    [TicketStatus.OPEN]: allTickets.filter(t => t.status === TicketStatus.OPEN).length,
    [TicketStatus.IN_PROGRESS]: allTickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
    [TicketStatus.CLOSED]: allTickets.filter(t => t.status === TicketStatus.CLOSED).length,
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsDialogOpen(true);
  };

  const handleDeleteTicket = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await deleteTicket(id);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete ticket");
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTicket(null);
  };

  const handleTicketSaved = () => {
    handleDialogClose();
    setError(null);
  };

  const getStatusBadgeVariant = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "destructive";
      case TicketStatus.IN_PROGRESS:
        return "secondary";
      case TicketStatus.CLOSED:
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "Open";
      case TicketStatus.IN_PROGRESS:
        return "In Progress";
      case TicketStatus.CLOSED:
        return "Closed";
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Ticket Management</h1>
            <p className="text-muted-foreground">
              Manage customer support tickets and inquiries
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Chart */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Analytics</CardTitle>
            <CardDescription>Overview of ticket trends and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Active Tickets</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statusCounts.all}</div>
                  <div className="flex space-x-2 mt-2">
                    <Badge variant="destructive">{statusCounts[TicketStatus.OPEN]} Open</Badge>
                    <Badge variant="secondary">{statusCounts[TicketStatus.IN_PROGRESS]} In Progress</Badge>
                    <Badge>{statusCounts[TicketStatus.CLOSED]} Closed</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="relative">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Ticket Resolution Rate</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {((statusCounts[TicketStatus.CLOSED] / (statusCounts.all || 1)) * 100).toFixed(1)}% resolved
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        ...allTickets
                          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                          .reduce((acc, ticket) => {
                            const date = new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const existing = acc.find(item => item.date === date);
                            if (existing) {
                              existing.total++;
                              if (ticket.status === TicketStatus.CLOSED) existing.closed++;
                            } else {
                              acc.push({ 
                                date, 
                                total: 1, 
                                closed: ticket.status === TicketStatus.CLOSED ? 1 : 0 
                              });
                            }
                            return acc;
                          }, [] as { date: string; total: number; closed: number }[])
                      ]}>
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                          }}
                        />
                        <Line type="monotone" dataKey="total" stroke="#94a3b8" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="closed" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>
            View and manage customer support requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex justify-end">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All
                <Badge variant="outline" className="ml-1">
                  {statusCounts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value={TicketStatus.OPEN} className="flex items-center gap-2">
                Open
                <Badge variant="destructive" className="ml-1">
                  {statusCounts[TicketStatus.OPEN]}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value={TicketStatus.IN_PROGRESS} className="flex items-center gap-2">
                In Progress
                <Badge variant="secondary" className="ml-1">
                  {statusCounts[TicketStatus.IN_PROGRESS]}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value={TicketStatus.CLOSED} className="flex items-center gap-2">
                Closed
                <Badge variant="default" className="ml-1">
                  {statusCounts[TicketStatus.CLOSED]}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {/* Error Display */}
              {(error || isError) && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-4">
                  {error || swrError?.message || "Failed to load tickets"}
                </div>
              )}

              {/* Tickets Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="py-3 px-4 border-b font-medium">Customer</th>
                      <th className="py-3 px-4 border-b font-medium">Contact</th>
                      <th className="py-3 px-4 border-b font-medium">Message</th>
                      <th className="py-3 px-4 border-b font-medium">Status</th>
                      <th className="py-3 px-4 border-b font-medium">Created</th>
                      <th className="py-3 px-4 border-b font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                            <span>Loading tickets...</span>
                          </div>
                        </td>
                      </tr>
                    ) : tickets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          {search.trim() || activeTab !== "all" 
                            ? "No tickets found matching your criteria." 
                            : "No tickets found."
                          }
                        </td>
                      </tr>
                    ) : (
                      tickets.map((ticket: Ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 border-b">
                            <div className="font-medium">{ticket.name}</div>
                            <div className="text-sm text-gray-500">{ticket.email}</div>
                          </td>
                          <td className="py-3 px-4 border-b">
                            <div className="text-sm">{ticket.phone}</div>
                          </td>
                          <td className="py-3 px-4 border-b">
                            <div className="max-w-xs truncate" title={ticket.message}>
                              {ticket.message}
                            </div>
                            {ticket.notes && (
                              <div className="text-xs text-gray-500 mt-1">
                                Notes: {ticket.notes}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 border-b">
                            <Badge variant={getStatusBadgeVariant(ticket.status)}>
                              {getStatusLabel(ticket.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 border-b text-sm text-gray-500">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 border-b">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditTicket(ticket)}
                                className="flex items-center space-x-1"
                              >
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteTicket(ticket.id)}
                                className="flex items-center space-x-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TicketDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        ticket={editingTicket}
        onSaved={handleTicketSaved}
      />
    </div>
  );
}