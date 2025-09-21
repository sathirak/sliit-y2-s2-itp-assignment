"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { getAllOrders, getOrderById, updateOrder, deleteOrder } from "@/lib/services/order";
import type { OrderDto, UpdateOrderDto } from "@/lib/dtos/order";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/modules/ui/dialog";
import { Label } from "@/modules/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/modules/ui/select";
import { Badge } from "@/modules/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/ui/card";
import { Loader2, Package, Eye, Edit, Trash2 } from "lucide-react";

function OrderDetailsModal({
	open,
	onClose,
	orderId,
}: {
	open: boolean;
	onClose: () => void;
	orderId: string | null;
}) {
	const [order, setOrder] = useState<OrderDto | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open && orderId) {
			fetchOrderDetails();
		}
	}, [open, orderId]);

	async function fetchOrderDetails() {
		if (!orderId) return;
		setLoading(true);
		try {
			const orderData = await getOrderById(orderId);
			setOrder(orderData);
		} catch (error) {
			console.error("Failed to fetch order details:", error);
		}
		setLoading(false);
	}

	if (!open) return null;

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center gap-2">
							<Eye className="h-6 w-6" /> Order Details
						</div>
					</DialogTitle>
					<DialogDescription>
						View detailed information about this order.
					</DialogDescription>
				</DialogHeader>
				{loading ? (
					<div className="flex justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				) : order ? (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label>Order ID</Label>
								<p className="font-mono text-sm">{order.id}</p>
							</div>
							<div>
								<Label>Customer ID</Label>
								<p className="font-mono text-sm">{order.customerId}</p>
							</div>
							<div>
								<Label>Status</Label>
								<Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
									{order.status}
								</Badge>
							</div>
							<div>
								<Label>Total Amount</Label>
								<p className="font-semibold">${order.totalAmount}</p>
							</div>
							<div>
								<Label>Order Date</Label>
								<p>{new Date(order.orderDate).toLocaleDateString()}</p>
							</div>
							<div>
								<Label>Delivery Date</Label>
								<p>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Not set'}</p>
							</div>
						</div>
						{order.notes && (
							<div>
								<Label>Notes</Label>
								<p className="text-sm text-gray-600">{order.notes}</p>
							</div>
						)}
					</div>
				) : (
					<p className="text-center py-8 text-gray-500">Order not found.</p>
				)}
			</DialogContent>
		</Dialog>
	);
}

function EditOrderModal({
	open,
	onClose,
	order,
	onUpdate,
}: {
	open: boolean;
	onClose: () => void;
	order: OrderDto | null;
	onUpdate: (orderId: string, data: UpdateOrderDto) => void;
}) {
	const [form, setForm] = useState({
		status: order?.status || 'pending',
		notes: order?.notes || '',
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (order) {
			setForm({
				status: order.status || 'pending',
				notes: order.notes || '',
			});
		}
	}, [order, open]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!order) return;
		setLoading(true);
		onUpdate(order.id, form);
		setLoading(false);
		onClose();
	}

	if (!open || !order) return null;

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center gap-2">
							<Edit className="h-6 w-6" /> Edit Order
						</div>
					</DialogTitle>
					<DialogDescription>
						Update the order status and notes.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="status">Status</Label>
						<Select
							value={form.status}
							onValueChange={(value) => setForm({ ...form, status: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="processing">Processing</SelectItem>
								<SelectItem value="shipped">Shipped</SelectItem>
								<SelectItem value="delivered">Delivered</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="notes">Notes</Label>
						<textarea
							id="notes"
							name="notes"
							value={form.notes}
							onChange={handleChange}
							placeholder="Enter order notes"
							className="w-full p-2 border rounded-md"
							rows={3}
						/>
					</div>
					<div className="flex justify-end space-x-2">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Update Order
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function Orders() {
	const [orders, setOrders] = useState<OrderDto[]>([]);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [loading, setLoading] = useState(true);
	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
	const [showDetails, setShowDetails] = useState(false);
	const [editingOrder, setEditingOrder] = useState<OrderDto | null>(null);
	const [showEdit, setShowEdit] = useState(false);

	useEffect(() => {
		fetchOrders();
	}, []);

	async function fetchOrders() {
		setLoading(true);
		try {
			const ordersData = await getAllOrders();
			setOrders(ordersData);
		} catch (error) {
			console.error("Failed to fetch orders:", error);
			setOrders([]);
		}
		setLoading(false);
	}

	const filteredOrders = orders.filter((order) => {
		const matchesSearch = 
			order.id?.toLowerCase().includes(search.toLowerCase()) ||
			order.customerId?.toLowerCase().includes(search.toLowerCase()) ||
			order.status?.toLowerCase().includes(search.toLowerCase());
		
		const matchesStatus = statusFilter === "all" || order.status === statusFilter;
		
		return matchesSearch && matchesStatus;
	});

	function handleViewOrder(orderId: string) {
		setSelectedOrderId(orderId);
		setShowDetails(true);
	}

	function handleEditOrder(order: OrderDto) {
		setEditingOrder(order);
		setShowEdit(true);
	}

	async function handleUpdateOrder(orderId: string, data: UpdateOrderDto) {
		setLoading(true);
		try {
			const updatedOrder = await updateOrder(orderId, data);
			setOrders((prev) => 
				prev.map((order) => order.id === orderId ? updatedOrder : order)
			);
		} catch (error) {
			console.error("Failed to update order:", error);
		}
		setLoading(false);
	}

	async function handleDeleteOrder(orderId: string) {
		if (!confirm("Are you sure you want to delete this order?")) return;
		
		setLoading(true);
		try {
			await deleteOrder(orderId);
			setOrders((prev) => prev.filter((order) => order.id !== orderId));
		} catch (error) {
			console.error("Failed to delete order:", error);
		}
		setLoading(false);
	}

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case 'completed':
			case 'delivered':
				return 'default';
			case 'processing':
			case 'shipped':
				return 'secondary';
			case 'cancelled':
				return 'destructive';
			default:
				return 'outline';
		}
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Package className="h-8 w-8" />
					<div>
						<h1 className="text-3xl font-bold">Order Management</h1>
						<p className="text-muted-foreground">
							View and manage customer orders
						</p>
					</div>
				</div>
			</div>

			<OrderDetailsModal
				open={showDetails}
				onClose={() => setShowDetails(false)}
				orderId={selectedOrderId}
			/>

			<EditOrderModal
				open={showEdit}
				onClose={() => setShowEdit(false)}
				order={editingOrder}
				onUpdate={handleUpdateOrder}
			/>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<Input
								type="text"
								placeholder="Search orders by ID, customer, or status..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<div className="w-full md:w-48">
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger>
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="processing">Processing</SelectItem>
									<SelectItem value="shipped">Shipped</SelectItem>
									<SelectItem value="delivered">Delivered</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Orders Table */}
			<Card>
				<CardHeader>
					<CardTitle>Orders ({filteredOrders.length})</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead>
								<tr className="border-b">
									<th className="text-left py-3 px-4">Order ID</th>
									<th className="text-left py-3 px-4">Customer</th>
									<th className="text-left py-3 px-4">Status</th>
									<th className="text-left py-3 px-4">Total</th>
									<th className="text-left py-3 px-4">Order Date</th>
									<th className="text-left py-3 px-4">Actions</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td colSpan={6} className="text-center py-8">
											<Loader2 className="h-6 w-6 animate-spin mx-auto" />
											<p className="text-muted-foreground mt-2">Loading orders...</p>
										</td>
									</tr>
								) : filteredOrders.length === 0 ? (
									<tr>
										<td colSpan={6} className="text-center py-8 text-muted-foreground">
											No orders found.
										</td>
									</tr>
								) : (
									filteredOrders.map((order) => (
										<tr key={order.id} className="border-b hover:bg-gray-50">
											<td className="py-3 px-4">
												<code className="text-sm">{order.id}</code>
											</td>
											<td className="py-3 px-4">
												<code className="text-sm">{order.customerId}</code>
											</td>
											<td className="py-3 px-4">
												<Badge variant={getStatusBadgeVariant(order.status)}>
													{order.status}
												</Badge>
											</td>
											<td className="py-3 px-4 font-semibold">
												${order.totalAmount}
											</td>
											<td className="py-3 px-4">
												{new Date(order.orderDate).toLocaleDateString()}
											</td>
											<td className="py-3 px-4">
												<div className="flex items-center space-x-2">
													<Button
														size="sm"
														variant="outline"
														onClick={() => handleViewOrder(order.id)}
													>
														<Eye className="h-4 w-4" />
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={() => handleEditOrder(order)}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() => handleDeleteOrder(order.id)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}