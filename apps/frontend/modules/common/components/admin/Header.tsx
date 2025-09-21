"use client";

import Image from 'next/image';
import Link from 'next/link';
import BrandLogoImg from '@/modules/assets/images/brand/logo.png';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Button } from '@/modules/ui/button';

export const Header = () => {
    const { user, loading, signOut } = useAuth();
    return (
        <header className="flex flex-col px-10 py-4 border-b">
            <div className="flex items-center gap-4">
                <Image src={BrandLogoImg} alt="Brand Logo" className="w-16 h-auto" />
                <div className="text-2xl font-bold tracking-widest">ADMIN</div>
            </div>

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700 font-bold">
                                Welcome, {user?.email}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={signOut}
                                disabled={loading}
                            >
                                SIGN OUT
                            </Button>
                        </div>
                    ) : (
                        <Link href="/sign-in">
                            <span className="text-sm text-gray-500 font-bold cursor-pointer hover:text-gray-700">
                                SIGN IN
                            </span>
                        </Link>
                    )}
                    
                </div>
            </div>
        </header>
    );
}
