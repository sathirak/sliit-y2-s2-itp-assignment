"use client";

import { Heart, ShoppingBag, FileText, Users, Settings, Search, Crown, Star, Gift, User } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BrandLogoImg from '@/modules/assets/images/brand/logo.png';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { CATEGORIES } from '@/lib/constants/categories';
import { useCartStore } from '@/lib/stores/cart.store';

export const Header = () => {
  const { user } = useAuth();
  const { totalItems } = useCartStore();
  const router = useRouter();

  // Check if user has admin access (owner, sales_rep)
  const hasAdminAccess = user && ['owner', 'sales_rep'].includes(user.roleName);
  // Check if user is a supplier
  const isSupplier = user && user.roleName === 'supplier';

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleCheckoutClick = () => {
    router.push('/checkout');
  };
  return (
    <header className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm">
      {/* Top section with brand */}
      <div className="px-6 py-4">
        <Link href="/" className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all duration-300 w-fit group">
          <div className="relative">
            <Image src={BrandLogoImg} alt="Brand Logo" className="w-20 h-auto group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <div className="text-3xl font-bold tracking-[0.3em] text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
            CROWNUP
          </div>
          <div className="text-xs text-gray-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
            <Crown size={12} /> Royal Fashion
          </div>
        </Link>
      </div>

      {/* Navigation and Right Side in one line */}
      <div className="flex items-center justify-between px-6 py-3">
        <nav className="flex-1">
          <ul className="flex gap-6 font-bold text-sm">
            {CATEGORIES.map((category) => (
              <li key={category} className="cursor-pointer hover:text-gray-600 transition-colors">
                <Link href={`/category/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}>
                  {category.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/my-account" className="flex items-center gap-2 hover:text-gray-900 transition-colors">
                <User size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700 font-bold">
                  Welcome, {user.firstName || user.email}
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Action buttons section */}
      <div className="px-6 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-t border-yellow-100">
        <div className="flex items-center gap-6">
          <Button variant="outline" size="sm" className="hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all duration-300 shadow-sm">
            <Heart size={16} className="mr-2" />
            <span className="font-semibold">WISHLIST (0)</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleCartClick} className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 shadow-sm">
            <ShoppingBag size={16} className="mr-2" />
            <span className="font-semibold">CART ({totalItems})</span>
          </Button>
          {totalItems > 0 && (
            <Button variant="default" size="sm" onClick={handleCheckoutClick}>
              CHECKOUT
            </Button>
          )}
          {hasAdminAccess && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all duration-300 shadow-sm">
                <Settings size={16} className="mr-2" />
                <span className="font-semibold">ADMIN</span>
              </Button>
            </Link>
          )}
          {isSupplier && (
            <Link href="/supplier/contracts">
              <Button variant="outline" size="sm" className="hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all duration-300 shadow-sm">
                <FileText size={16} className="mr-2" />
                <span className="font-semibold">CONTRACTS</span>
              </Button>
            </Link>
          )}
          <div className="ml-auto text-xs text-gray-500 flex items-center gap-1">
            <Gift size={12} />
            <span>Free shipping on orders over $100</span>
          </div>
        </div>
      </div>
    </header>
  );
}
