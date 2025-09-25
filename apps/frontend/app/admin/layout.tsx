import { Header } from '@/modules/common/components/admin/Header';
import { AdminRouteGuard } from '@/modules/common/components/admin/AdminRouteGuard';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CrownUp Admin Panel",
    description: "Administrative dashboard for CrownUp Clothing Store",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AdminRouteGuard>
            <Header />
            <main className="min-h-screen p-6 bg-gray-50">
                {children}
            </main>
        </AdminRouteGuard>
    );
}
