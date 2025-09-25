"use client";

import Image from 'next/image';
import Link from 'next/link';
import BrandLogoImg from '@/modules/assets/images/brand/logo.png';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { getRoleDisplayName } from '@/lib/utils/admin-navigation';
import { Button } from '@/modules/ui/button';
import { Shield, Crown, Settings } from 'lucide-react';

export const Header = () => {
    const { user, isLoading, logout } = useAuth();
    
    return (
        <header className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm">
            {/* Top section with brand */}
            <div className="px-8 py-6">
                <Link href="/admin" className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all duration-300 w-fit group">
                    <div className="relative">
                        <Image src={BrandLogoImg} alt="Brand Logo" className="w-20 h-auto group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-3xl font-bold tracking-[0.3em] text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                        CROWNUP
                    </div>
                    <div className="text-xs text-gray-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                        <Settings size={12} /> Admin Panel
                    </div>
                </Link>
            </div>

            {/* Navigation section */}
            <div className="px-8 py-4 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <nav className="flex-1">
                        <div className="flex items-center gap-2">
                            <Settings size={16} className="text-yellow-600" />
                            <span className="text-lg font-semibold text-gray-900">Admin Dashboard</span>
                        </div>
                    </nav>
                    
                    <div className="flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* Role Badge */}
                                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-200">
                                    <Shield size={16} className="text-yellow-600" />
                                    <span className="text-sm font-semibold text-yellow-800">
                                        {getRoleDisplayName(user.roleName)}
                                    </span>
                                </div>
                                
                                <Link href="/my-account">
                                    <span className="text-sm text-gray-700 font-semibold cursor-pointer hover:text-yellow-600 transition-colors duration-300 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <Crown size={16} className="text-yellow-600" />
                                        </div>
                                        {user.firstName || user.email}
                                    </span>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={logout} 
                                    disabled={isLoading}
                                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
                                >
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Link href="/sign-in">
                                <Button variant="outline" className="hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300 transition-all duration-300 flex items-center gap-2">
                                    <Crown size={16} /> SIGN IN
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Admin info section */}
            <div className="px-8 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-t border-yellow-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <Crown size={14} className="text-yellow-600" />
                            <span>Administrative Control Panel</span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        Manage your CrownUp business operations
                    </div>
                </div>
            </div>
        </header>
    );
};
