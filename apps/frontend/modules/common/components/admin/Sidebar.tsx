
import Link from 'next/link';
import { Package, FileText, Users, ShoppingBag, Ticket } from 'lucide-react';

export const Sidebar = () => {
	return (
		<aside className="w-60 min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 border-r shadow-lg rounded-r-2xl p-6 flex flex-col gap-10 animate-in fade-in duration-500">
			<nav className="flex flex-col gap-4 mt-4">
				<Link href="/admin/product-management" className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 group">
					<Package size={20} className="text-gray-500 group-hover:text-gray-700" /> Products
				</Link>
				<Link href="/admin/contract-management" className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 group">
					<FileText size={20} className="text-gray-500 group-hover:text-gray-700" /> Contracts
				</Link>
				<Link href="/admin/users" className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 group">
					<Users size={20} className="text-gray-500 group-hover:text-gray-700" /> Users
				</Link>
				<Link href="/admin/order-management" className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 group">
					<ShoppingBag size={20} className="text-gray-500 group-hover:text-gray-700" /> Orders
				</Link>
				<Link href="/admin/tickets" className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 group">
					<Ticket size={20} className="text-gray-500 group-hover:text-gray-700" /> Ticket
				</Link>
			</nav>
		</aside>
	);
};
