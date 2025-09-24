"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { useUsers, useSearchUsers, useUserMutations } from "@/lib/hooks/useUsers";
import type { UserDto } from "@/lib/dtos/user";
import { Loader2, UserPlus, Search, Trash2, Edit } from "lucide-react";
import { AddUserModal, EditUserModal } from "./index";
import type { CreateUserFormData, EditUserFormData } from "./index";

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
	       <div className="flex items-center gap-4">
	         <User className="h-10 w-10 text-blue-500 animate-in fade-in duration-500" />
	         <div>
	           <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">User Management</h1>
	           <p className="text-gray-500 text-base">Manage your users and their details (Owner access only)</p>
	         </div>
	       </div>
	       <Button
	         onClick={() => setShowAdd(true)}
	         className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150"
	       >
	         <UserPlus className="h-5 w-5" />
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
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
					Failed to load users. Please try again.
				</div>
			)}

	     {/* Users Table - Card Style */}
	     <div className="overflow-x-auto">
	       <table className="min-w-full bg-white border rounded-2xl shadow-lg">
	         <thead className="sticky top-0 z-10">
	           <tr className="bg-gradient-to-r from-blue-50 via-white to-blue-50 text-left">
	             <th className="py-3 px-4 border-b font-bold">User</th>
	             <th className="py-3 px-4 border-b font-bold">Email</th>
	             <th className="py-3 px-4 border-b font-bold">Role</th>
	             <th className="py-3 px-4 border-b font-bold">Created At</th>
	             <th className="py-3 px-4 border-b font-bold">Actions</th>
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
									 <tr key={user.id} className="hover:bg-blue-50 transition-all duration-150">
										 <td className="py-3 px-4 border-b flex items-center gap-3">
											 <span className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border border-blue-200 shadow-sm">
												 {user.firstName ? user.firstName[0] : user.email[0]}
											 </span>
											 <span className="font-semibold text-gray-800">{`${user.firstName} ${user.lastName}` || "-"}</span>
										 </td>
										 <td className="py-3 px-4 border-b text-gray-700">
											 {user.email || "-"}
										 </td>
										 <td className="py-3 px-4 border-b">
																 <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${user.roleName === 'owner' ? 'bg-purple-100 text-purple-700' : user.roleName === 'supplier' ? 'bg-blue-100 text-blue-700' : user.roleName === 'sales_rep' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
																	 {user.roleName || "-"}
																 </span>
										 </td>
										 <td className="py-3 px-4 border-b text-gray-500">
											 {user.createdAt 
												 ? new Date(user.createdAt).toLocaleDateString()
												 : "-"
											 }
										 </td>
										 <td className="py-3 px-4 border-b">
											 <div className="flex gap-2">
												 <Button
													 size="sm"
													 variant="outline"
													 onClick={() => handleEditUser(user)}
													 className="flex items-center gap-1 hover:bg-blue-100 active:bg-blue-200 transition-all duration-150"
													 disabled={isSubmitting}
													 title="Edit user"
												 >
													 <Edit className="h-4 w-4" />
													 <span>Edit</span>
												 </Button>
												 <Button 
													 size="sm" 
													 variant="destructive" 
													 onClick={() => handleDeleteUser(user.id)}
													 className="flex items-center gap-1 hover:bg-red-100 active:bg-red-200 transition-all duration-150"
													 disabled={isSubmitting}
													 title="Delete user"
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
