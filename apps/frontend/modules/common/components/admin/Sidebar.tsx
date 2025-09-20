
import Link from 'next/link';

export const Sidebar = () => {
	return (
		<aside className="w-56 h-full border-r p-4 gap-14 flex flex-col">
			<nav className="flex flex-col gap-4">
				<Link href="/admin/product-management" className="font-medium">Products</Link>
				<Link href="/admin/contract-management" className="font-medium">Contracts</Link>
				<Link href="/admin/user-management" className="font-medium">Users</Link>
				<Link href="/admin/order-management" className="font-medium">Orders</Link>
                <Link href="/admin/ticket-management" className="font-medium">Ticket</Link>
			</nav>
		</aside>
	);
};
