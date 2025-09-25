

import Link from 'next/link';
import { Package, FileText, Users, CreditCard, Ticket } from 'lucide-react';

export const Sidebar = () => {
	return (
		<aside className="w-56 h-full min-h-svh border-r bg-background p-4 flex flex-col gap-10 ">
			<nav className="flex flex-col gap-2">
				<SidebarItem href="/admin/product-management" icon={<Package size={18} className="mr-2" />} label="Products" />
				<SidebarItem href="/admin/contract-management" icon={<FileText size={18} className="mr-2" />} label="Contracts" />
				<SidebarItem href="/admin/users" icon={<Users size={18} className="mr-2" />} label="Users" />
				<SidebarItem href="/admin/billing" icon={<CreditCard size={18} className="mr-2" />} label="Billing" />
				<SidebarItem href="/admin/tickets" icon={<Ticket size={18} className="mr-2" />} label="Tickets" />
			</nav>
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
