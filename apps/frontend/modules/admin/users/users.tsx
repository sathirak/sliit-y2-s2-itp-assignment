"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/lib/services/user";
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
import { Textarea } from "@/modules/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/modules/ui/select";
import { Loader2, UserPlus } from "lucide-react";

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
		name: "",
		email: "",
		roleName: "customer",
		password: "",
		description: "",
	});
	const [loading, setLoading] = useState(false);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		onCreate({ ...form, roleName: form.roleName as UserDto["roleName"] });
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
							<UserPlus className="h-6 w-6" /> Create New User
						</div>
					</DialogTitle>
					<DialogDescription>
						Fill in the details to create a new user.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name *</Label>
							<Input
								id="name"
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder="Enter name"
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
						<div className="space-y-2">
							<Label htmlFor="password">Password *</Label>
							<Input
								id="password"
								name="password"
								value={form.password}
								onChange={handleChange}
								placeholder="Enter password"
								type="password"
								required
							/>
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
		name: user?.name || "",
		email: user?.email || "",
		roleName: user?.roleName || "customer",
		password: "",
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setForm({
			name: user?.name || "",
			email: user?.email || "",
			roleName: user?.roleName || "customer",
			password: "",
		});
	}, [user, open]);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
							<UserPlus className="h-6 w-6" /> Edit User
						</div>
					</DialogTitle>
					<DialogDescription>
						Update the details for this user.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name *</Label>
							<Input
								id="name"
								name="name"
								value={form.name}
								onChange={handleChange}
								placeholder="Enter name"
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
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								value={form.password}
								onChange={handleChange}
								placeholder="Enter new password (optional)"
								type="password"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							name="description"
							onChange={handleChange}
							placeholder="Enter user description"
							rows={3}
						/>
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
	const [showAdd, setShowAdd] = useState(false);
	const [editingUser, setEditingUser] = useState<UserDto | null>(null);
	const [showEdit, setShowEdit] = useState(false);

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

	const filteredUsers = users.filter(
		(user) =>
			user.name?.toLowerCase().includes(search.toLowerCase()) ||
			user.email?.toLowerCase().includes(search.toLowerCase()) ||
			user.roleName?.toLowerCase().includes(search.toLowerCase())
	);

	async function handleCreateUser(newUser: Partial<UserDto>) {
		setLoading(true);
		try {
			const created = await createUser(newUser);
			setUsers((prev) => [created, ...prev]);
		} catch (e) {
			// Optionally show error
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
			// Optionally show error
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
							Manage your users and their details
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
			<div className="mb-4 flex justify-end">
				<Input
					type="text"
					placeholder="Search users..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-64"
				/>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border rounded-lg">
					<thead>
						<tr className="bg-gray-100 text-left">
							<th className="py-2 px-4 border-b">Name</th>
							<th className="py-2 px-4 border-b">Email</th>
							<th className="py-2 px-4 border-b">Role</th>
							<th className="py-2 px-4 border-b">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={4} className="text-center py-4 text-gray-500">
									Loading...
								</td>
							</tr>
						) : filteredUsers.length === 0 ? (
							<tr>
								<td colSpan={4} className="text-center py-4 text-gray-500">
									No users found.
								</td>
							</tr>
						) : (
							filteredUsers.map((user, idx) => (
								<tr key={user.id || idx} className="hover:bg-gray-50">
									<td className="py-2 px-4 border-b">
										{user.name ||
											`${user.firstName} ${user.lastName}` ||
											"-"}
									</td>
									<td className="py-2 px-4 border-b">
										{user.email || "-"}
									</td>
									<td className="py-2 px-4 border-b">
										{user.roleName || "-"}
									</td>
									<td className="py-2 px-4 border-b">
										<Button
											size="sm"
											variant="outline"
											className="mr-2"
											onClick={() => handleEditUser(user)}
										>
											Edit
										</Button>
										<Button size="sm" variant="destructive" onClick={async () => {
											setLoading(true);
											try {
												await deleteUser(user.id);
												setUsers((prev) => prev.filter((u) => u.id !== user.id));
											} catch (e) {
												// Optionally show error
											}
											setLoading(false);
										}}>
											Delete
										</Button>
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

