import { Header } from '@/modules/common/components/admin/Header';
import { Sidebar } from '@/modules/common/components/admin/Sidebar';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CrownUp Clothing Store",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </>
    );
}
