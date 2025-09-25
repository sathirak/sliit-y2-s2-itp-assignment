"use client";

import React, { useState } from "react";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/ui/card";
import { useUsers, useSearchUsers, useUserMutations } from "@/lib/hooks/useUsers";
import type { UserDto } from "@/lib/dtos/user";
import { Loader2, UserPlus, Search, Trash2, Edit } from "lucide-react";
import { AddUserModal, EditUserModal } from "./index";
import type { CreateUserFormData, EditUserFormData } from "./index";
import { UserRegistrationChart } from "./UserRegistrationChart";
import { UserStatsCards } from "./UserStatsCards";

export default function Users() {
	const [search, setSearch] = useState("");
	const [showAdd, setShowAdd] = useState(false);
	const [editingUser, setEditingUser] = useState<UserDto | null>(null);
	const [showEdit, setShowEdit] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// SWR hooks for data fetching
	const { users: allUsers, isLoading: loadingUsers, isError: usersError } = useUsers();
	const { users: searchResults, isLoading: searchLoading } = useSearchUsers(search, search.trim().length > 0);
	const { createUser, updateUser, deleteUser } = useUserMutations();

	// Determine which users to display
	const displayUsers = search.trim().length > 0 ? searchResults : allUsers;
	const isLoading = search.trim().length > 0 ? searchLoading : loadingUsers;

	async function handleCreateUser(formData: CreateUserFormData) {
		setIsSubmitting(true);
		try {
			await createUser(formData);
			setShowAdd(false);
		} catch (error) {
			console.error("Error creating user:", error);
		} finally {
			setIsSubmitting(false);
		}
	}

	function handleEditUser(user: UserDto) {
		setEditingUser(user);
		setShowEdit(true);
	}

	async function handleUpdateUser(formData: EditUserFormData) {
		if (!editingUser) return;
		
		setIsSubmitting(true);
		try {
			await updateUser(editingUser.id, formData);
			setShowEdit(false);
			setEditingUser(null);
		} catch (error) {
			console.error("Error updating user:", error);
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleDeleteUser(userId: string) {
		if (!confirm("Are you sure you want to delete this user?")) return;
		
		setIsSubmitting(true);
		try {
			await deleteUser(userId);
		} catch (error) {
			console.error("Error deleting user:", error);
		} finally {
			setIsSubmitting(false);
		}
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
				onCreateUser={handleCreateUser}
				isSubmitting={isSubmitting}
			/>
			
			<EditUserModal
				open={showEdit}
				onClose={() => setShowEdit(false)}
				user={editingUser}
				onUpdateUser={handleUpdateUser}
				isSubmitting={isSubmitting}
			/>

			{/* User Stats Cards */}
			<UserStatsCards users={allUsers} className="mb-6" />

			{/* User Registration Chart */}
			<Card>
				<CardHeader>
					<CardTitle>User Analytics</CardTitle>
					<CardDescription>
						Monthly user registration trends and statistics
					</CardDescription>
				</CardHeader>
				<CardContent>
					<UserRegistrationChart users={allUsers} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
					<CardDescription>
						View and manage all users in your system
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
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
							{isLoading && search.trim().length > 0 && (
								<Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
							)}
						</div>
					</div>

					{/* Error Display */}
					{usersError && (
						<div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
							Failed to load users. Please try again.
						</div>
					)}

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
						{isLoading ? (
							<tr>
								<td colSpan={5} className="text-center py-4 text-gray-500">
									<div className="flex items-center justify-center space-x-2">
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>Loading...</span>
									</div>
								</td>
							</tr>
						) : displayUsers.length === 0 ? (
							<tr>
								<td colSpan={5} className="text-center py-4 text-gray-500">
									{search.trim() ? "No users found matching your search." : "No users found."}
								</td>
							</tr>
						) : (
							displayUsers.map((user: UserDto) => (
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
												disabled={isSubmitting}
											>
												<Edit className="h-4 w-4" />
												<span>Edit</span>
											</Button>
											<Button 
												size="sm" 
												variant="destructive" 
												onClick={() => handleDeleteUser(user.id)}
												className="flex items-center space-x-1"
												disabled={isSubmitting}
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
				</CardContent>
			</Card>
		</div>
	);
}
