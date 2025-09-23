"use client"
import { useTickets, useTicketMutations } from '@/lib/hooks/useTickets';
import { TicketStatus } from '@/lib/dtos/ticket';
import { Button } from '@/modules/ui/button';
import { Card } from '@/modules/ui/card';
import { useState } from 'react';

export default function AdminTicketsPage() {
  const { tickets, isLoading, isError } = useTickets();
  const { updateTicket, deleteTicket } = useTicketMutations();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<TicketStatus | ''>('');

  if (isLoading) return <div>Loading tickets...</div>;
  if (isError) return <div>Error loading tickets.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tickets</h1>
      <div className="space-y-4">
        {tickets.map(ticket => (
          <Card key={ticket.id} className="p-4 flex flex-col gap-2">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div>
                <div className="font-semibold">{ticket.name} ({ticket.email})</div>
                <div className="text-sm text-gray-600">{ticket.phone}</div>
                <div className="text-sm text-gray-800 mt-1">{ticket.message}</div>
                <div className="text-xs text-gray-400 mt-1">Created: {new Date(ticket.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-2 min-w-[200px]">
                {editingId === ticket.id ? (
                  <>
                    <select
                      className="border rounded px-2 py-1"
                      value={editStatus || ticket.status}
                      onChange={e => setEditStatus(e.target.value as TicketStatus)}
                    >
                      {Object.values(TicketStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <textarea
                      className="border rounded px-2 py-1 mt-1"
                      value={editNotes}
                      placeholder="Notes"
                      onChange={e => setEditNotes(e.target.value)}
                    />
                    <div className="flex gap-2 mt-1">
                      <Button size="sm" onClick={async () => {
                        await updateTicket(ticket.id, { status: editStatus || ticket.status, notes: editNotes });
                        setEditingId(null);
                        setEditNotes('');
                        setEditStatus('');
                      }}>Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs">Status: <span className="font-semibold">{ticket.status}</span></div>
                    <div className="text-xs">Notes: {ticket.notes || <span className="italic text-gray-400">None</span>}</div>
                    <div className="flex gap-2 mt-1">
                      <Button size="sm" onClick={() => {
                        setEditingId(ticket.id);
                        setEditNotes(ticket.notes || '');
                        setEditStatus(ticket.status);
                      }}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={async () => { await deleteTicket(ticket.id); }}>Delete</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
