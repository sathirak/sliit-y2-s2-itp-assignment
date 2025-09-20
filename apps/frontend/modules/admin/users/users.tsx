"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { getUser } from "@/lib/services/user";
import type { UserDto } from "@/lib/dtos/user";

export default function Users() {
	const [users, setUsers] = useState<UserDto[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchUsers() {
			setLoading(true);
			try {
				const user = await getUser();
				setUsers([user]);
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

	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-bold">User Management</h2>
				<Button>Add User</Button>
			</div>
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
										{user.name || `${user.firstName} ${user.lastName}` || "-"}
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
										>
											Edit
										</Button>
										<Button size="sm" variant="destructive">
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

