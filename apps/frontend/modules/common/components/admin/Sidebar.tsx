
"use client";

import Link from 'next/link';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { getNavigationItemsByRole, getRoleDisplayName } from '@/lib/utils/admin-navigation';
import { Shield, AlertTriangle } from 'lucide-react';

export const Sidebar = () => {
	const { user } = useAuth();
	
	// Get navigation items based on user role
	const navigationItems = getNavigationItemsByRole(user?.roleName);
	
	// If no user or no navigation items, show limited access message
	if (!user || navigationItems.length === 0) {
		return (
			<aside className="w-56 h-full min-h-svh border-r bg-background p-4 flex flex-col gap-4">
				<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
					<AlertTriangle size={18} className="text-red-500" />
					<span className="text-sm text-red-700 font-medium">Access Denied</span>
				</div>
				<p className="text-xs text-gray-500 px-3">
					You don't have permission to access admin features.
				</p>
			</aside>
		);
	}

	return (
		<aside className="w-56 h-full min-h-svh border-r bg-background p-4 flex flex-col gap-6">
			{/* User Role Badge */}
			<div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
				<Shield size={18} className="text-blue-600" />
				<div className="flex flex-col">
					<span className="text-sm font-semibold text-blue-900">
						{getRoleDisplayName(user.roleName)}
					</span>
					<span className="text-xs text-blue-600">
						{user.firstName || user.email}
					</span>
				</div>
			</div>
			
			{/* Dynamic Navigation */}
			<nav className="flex flex-col gap-2">
				{navigationItems.map((item) => (
					<SidebarItem 
						key={item.href}
						href={item.href} 
						icon={<item.icon size={18} className="mr-2" />} 
						label={item.label} 
					/>
				))}
			</nav>
			
			{/* Access Summary */}
			<div className="mt-auto p-3 bg-gray-50 border border-gray-200 rounded-md">
				<h4 className="text-xs font-semibold text-gray-700 mb-2">Your Access</h4>
				<ul className="text-xs text-gray-600 space-y-1">
					{navigationItems.map((item) => (
						<li key={item.href} className="flex items-center gap-1">
							<div className="w-1 h-1 bg-green-500 rounded-full"></div>
							{item.label}
						</li>
					))}
				</ul>
			</div>
		</aside>
	);
};

function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
	return (
		<Link
			href={href}
			className="flex items-center gap-4 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
		>
			{icon}
			{label}
		</Link>
	);
}
