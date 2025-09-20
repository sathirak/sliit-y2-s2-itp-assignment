import { Header } from '@/modules/common/components/Header';
import { Footer } from '@/modules/common/components/Footer';
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
            {children}
            <Footer />
        </>
    );
}
