"use client";

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { getAllUsers, createUser, updateUser, deleteUser, searchUsers } from "@/lib/services/user";
import type { UserDto } from "@/lib/dtos/user";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { Loader2, UserPlus, Search, Trash2, Edit } from "lucide-react";

function AddUserModal({
	open,
	onClose,
	onCreate,
}: {
	open: boolean;
	onClose: () => void;
	onCreate: (user: Partial<UserDto>) => void;
}) {
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		roleName: "customer",
	});
	const [loading, setLoading] = useState(false);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		onCreate({ ...form, roleName: form.roleName as UserDto["roleName"] });
		setLoading(false);
		onClose();
		setForm({ firstName: "", lastName: "", email: "", roleName: "customer" });
	}

	if (!open) return null;
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center gap-2">
							<UserPlus className="h-6 w-6" /> Add New User
						</div>
					</DialogTitle>
					<DialogDescription>
						Create a new user with their basic information.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name *</Label>
							<Input
								id="firstName"
								name="firstName"
								value={form.firstName}
								onChange={handleChange}
								placeholder="Enter first name"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name *</Label>
							<Input
								id="lastName"
								name="lastName"
								value={form.lastName}
								onChange={handleChange}
								placeholder="Enter last name"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								placeholder="Enter email"
								type="email"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="roleName">Role *</Label>
							<Select
								value={form.roleName}
								onValueChange={(value) =>
									handleChange({
										target: { name: "roleName", value },
									} as any)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="customer">Customer</SelectItem>
									<SelectItem value="owner">Owner</SelectItem>
									<SelectItem value="sales_rep">Sales Rep</SelectItem>
									<SelectItem value="supplier">Supplier</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Create User
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function EditUserModal({
	open,
	onClose,
	user,
	onUpdate,
}: {
	open: boolean;
	onClose: () => void;
	user: UserDto | null;
	onUpdate: (user: Partial<UserDto>) => void;
}) {
	const [form, setForm] = useState({
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		email: user?.email || "",
		roleName: user?.roleName || "customer",
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setForm({
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			email: user?.email || "",
			roleName: user?.roleName || "customer",
		});
	}, [user, open]);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		onUpdate({ ...form, roleName: form.roleName as UserDto["roleName"] });
		setLoading(false);
		onClose();
	}

	if (!open) return null;
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center gap-2">
							<Edit className="h-6 w-6" /> Edit User
						</div>
					</DialogTitle>
					<DialogDescription>
						Update the details for this user.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name *</Label>
							<Input
								id="firstName"
								name="firstName"
								value={form.firstName}
								onChange={handleChange}
								placeholder="Enter first name"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name *</Label>
							<Input
								id="lastName"
								name="lastName"
								value={form.lastName}
								onChange={handleChange}
								placeholder="Enter last name"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								placeholder="Enter email"
								type="email"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="roleName">Role *</Label>
							<Select
								value={form.roleName}
								onValueChange={(value) =>
									handleChange({
										target: { name: "roleName", value },
									} as any)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="customer">Customer</SelectItem>
									<SelectItem value="owner">Owner</SelectItem>
									<SelectItem value="sales_rep">Sales Rep</SelectItem>
									<SelectItem value="supplier">Supplier</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Update User
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function Users() {
	const [users, setUsers] = useState<UserDto[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [searching, setSearching] = useState(false);
	const [showAdd, setShowAdd] = useState(false);
	const [editingUser, setEditingUser] = useState<UserDto | null>(null);
	const [showEdit, setShowEdit] = useState(false);

	// Debounced search function
	const debouncedSearch = useCallback(
		debounce(async (query: string) => {
			if (!query.trim()) {
				// If search is empty, fetch all users
				try {
					const users = await getAllUsers();
					setUsers(users);
				} catch (e) {
					setUsers([]);
				}
				setSearching(false);
				return;
			}

			setSearching(true);
			try {
				const searchResults = await searchUsers(query);
				setUsers(searchResults);
			} catch (e) {
				setUsers([]);
			}
			setSearching(false);
		}, 500),
		[]
	);

	useEffect(() => {
		async function fetchUsers() {
			setLoading(true);
			try {
				const users = await getAllUsers();
				setUsers(users);
			} catch (e) {
				setUsers([]);
			}
			setLoading(false);
		}
		fetchUsers();
	}, []);

	// Handle search input changes
	useEffect(() => {
		if (search.trim() === "") {
			// Reset to all users when search is cleared
			debouncedSearch("");
		} else {
			debouncedSearch(search);
		}
	}, [search, debouncedSearch]);

	async function handleCreateUser(newUser: Partial<UserDto>) {
		setLoading(true);
		try {
			const created = await createUser(newUser);
			setUsers((prev) => [created, ...prev]);
		} catch (e) {
			console.error("Error creating user:", e);
		}
		setLoading(false);
	}

	function handleEditUser(user: UserDto) {
		setEditingUser(user);
		setShowEdit(true);
	}

	async function handleUpdateUser(updated: Partial<UserDto>) {
		if (!editingUser) return;
		setLoading(true);
		try {
			const updatedUser = await updateUser(editingUser.id, updated);
			setUsers((prev) => prev.map((u) => u.id === updatedUser.id ? updatedUser : u));
		} catch (e) {
			console.error("Error updating user:", e);
		}
		setLoading(false);
	}

	async function handleDeleteUser(userId: string) {
		if (!confirm("Are you sure you want to delete this user?")) return;
		
		setLoading(true);
		try {
			await deleteUser(userId);
			setUsers((prev) => prev.filter((u) => u.id !== userId));
		} catch (e) {
			console.error("Error deleting user:", e);
		}
		setLoading(false);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<UserPlus className="h-8 w-8" />
					<div>
						<h1 className="text-3xl font-bold">User Management</h1>
						<p className="text-muted-foreground">
							Manage your users and their details (Owner access only)
						</p>
					</div>
				</div>
				<Button
					onClick={() => setShowAdd(true)}
					className="flex items-center space-x-2"
				>
					<UserPlus className="h-4 w-4" />
					<span>Add User</span>
				</Button>
			</div>

			<AddUserModal
				open={showAdd}
				onClose={() => setShowAdd(false)}
				onCreate={handleCreateUser}
			/>
			
			<EditUserModal
				open={showEdit}
				onClose={() => setShowEdit(false)}
				user={editingUser}
				onUpdate={handleUpdateUser}
			/>

			{/* Search Section */}
			<div className="flex justify-end">
				<div className="relative w-64">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						type="text"
						placeholder="Search by name or email..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-10"
					/>
					{searching && (
						<Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
					)}
				</div>
			</div>

			{/* Users Table */}
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border rounded-lg">
					<thead>
						<tr className="bg-gray-100 text-left">
							<th className="py-2 px-4 border-b">Name</th>
							<th className="py-2 px-4 border-b">Email</th>
							<th className="py-2 px-4 border-b">Role</th>
							<th className="py-2 px-4 border-b">Created At</th>
							<th className="py-2 px-4 border-b">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={5} className="text-center py-4 text-gray-500">
									<div className="flex items-center justify-center space-x-2">
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>Loading...</span>
									</div>
								</td>
							</tr>
						) : users.length === 0 ? (
							<tr>
								<td colSpan={5} className="text-center py-4 text-gray-500">
									{search.trim() ? "No users found matching your search." : "No users found."}
								</td>
							</tr>
						) : (
							users.map((user) => (
								<tr key={user.id} className="hover:bg-gray-50">
									<td className="py-2 px-4 border-b">
										{`${user.firstName} ${user.lastName}` || "-"}
									</td>
									<td className="py-2 px-4 border-b">
										{user.email || "-"}
									</td>
									<td className="py-2 px-4 border-b">
										<span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{user.roleName || "-"}
										</span>
									</td>
									<td className="py-2 px-4 border-b">
										{user.createdAt 
											? new Date(user.createdAt).toLocaleDateString()
											: "-"
										}
									</td>
									<td className="py-2 px-4 border-b">
										<div className="flex space-x-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => handleEditUser(user)}
												className="flex items-center space-x-1"
											>
												<Edit className="h-4 w-4" />
												<span>Edit</span>
											</Button>
											<Button 
												size="sm" 
												variant="destructive" 
												onClick={() => handleDeleteUser(user.id)}
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
		</div>
	);
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
	let timeout: NodeJS.Timeout;
	return ((...args: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	}) as T;
}
