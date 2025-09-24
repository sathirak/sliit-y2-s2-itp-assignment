"use client";
import React, { useEffect, useState } from 'react';
import { getTickets } from '@/lib/services/ticket';
import type { Ticket, TicketStatus } from '@/lib/dtos/ticket';

const statusColors: Record<TicketStatus, string> = {
	OPEN: 'bg-yellow-100 text-yellow-800',
	IN_PROGRESS: 'bg-blue-100 text-blue-800',
	CLOSED: 'bg-green-100 text-green-800',
};

export default function AdminTicketsPage() {
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getTickets()
			.then(setTickets)
			.catch((e) => setError(e.message || 'Failed to load tickets'))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">All Tickets</h1>
			{loading && <div>Loading tickets...</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && (
				<div className="overflow-x-auto">
					<table className="min-w-full border border-gray-200 bg-white">
						<thead>
							<tr className="bg-gray-100">
								<th className="px-4 py-2 border">ID</th>
								<th className="px-4 py-2 border">Name</th>
								<th className="px-4 py-2 border">Email</th>
								<th className="px-4 py-2 border">Phone</th>
								<th className="px-4 py-2 border">Message</th>
								<th className="px-4 py-2 border">Status</th>
								<th className="px-4 py-2 border">Created At</th>
							</tr>
						</thead>
						<tbody>
							{tickets.map((ticket) => (
								<tr key={ticket.id} className="border-b">
									<td className="px-4 py-2 border font-mono text-xs">{ticket.id}</td>
									<td className="px-4 py-2 border">{ticket.name}</td>
									<td className="px-4 py-2 border">{ticket.email}</td>
									<td className="px-4 py-2 border">{ticket.phone}</td>
									<td className="px-4 py-2 border max-w-xs truncate" title={ticket.message}>{ticket.message}</td>
									<td className={`px-4 py-2 border`}>
										<span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[ticket.status]}`}>{ticket.status}</span>
									</td>
									<td className="px-4 py-2 border">{new Date(ticket.createdAt).toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</table>
					{tickets.length === 0 && <div className="text-center py-8">No tickets found.</div>}
				</div>
			)}
		</div>
	);
}
