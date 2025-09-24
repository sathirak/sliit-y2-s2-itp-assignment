"use client";

import { Heart, ShoppingBag, FileText, Users } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import Image from 'next/image';
import Link from 'next/link';
import BrandLogoImg from '@/modules/assets/images/brand/logo.png';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export const Header = () => {
  const { user, logout } = useAuth();
  // Helper to get initials from user name/email
  const getInitials = (user: any): string => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.name) {
      return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return '';
  };
  return (
  <header className="flex flex-col px-10 py-4 border-b bg-gradient-to-r from-white via-gray-50 to-white shadow-md transition-all duration-500 sticky top-0 z-30 backdrop-blur-md">
  <div className="flex items-center gap-6">
        <Image src={BrandLogoImg} alt="Brand Logo" className="w-16 h-auto" />
        <div className="text-2xl font-bold tracking-widest">CROWNUP</div>
      </div>

      {/* Navigation and Right Side in one line */}
  <div className="flex items-center justify-between mt-4">
        <nav className="flex-1" aria-label="Main navigation">
          <ul className="flex gap-6 font-bold text-sm mt-2">
            {['WOMEN', 'SALE', 'THIS WEEK', 'WORKWEAR', 'ACTIVE WEAR', 'LINEN', 'NATURAL BLENDS', 'DENIM', 'OCCASION'].map((item) => (
              <li
                key={item}
                className="cursor-pointer relative group transition-transform duration-150 active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
                tabIndex={0}
                aria-label={item}
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gray-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
              </li>
            ))}
          </ul>
        </nav>
  <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-2">
              {/* User Avatar/Initials */}
              <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-base border border-gray-300 mr-2 animate-in fade-in duration-500" title="Account">
                {getInitials(user)}
              </span>
              <Link href="/my-account">
                <span className="text-sm text-gray-700 font-bold cursor-pointer hover:text-gray-900 transition-transform duration-150 active:scale-95 hover:scale-105" title="Go to My Account">
                  Welcome, {user.firstName || user.email}
                </span>
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="ml-2 transition-transform duration-150 active:scale-95 hover:scale-105" title="Sign Out">
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <span className="text-sm text-gray-500 font-bold cursor-pointer hover:text-gray-700 transition-transform duration-150 active:scale-95 hover:scale-105" title="Sign In">
                SIGN IN
              </span>
            </Link>
          )}
          <form className="flex items-center" role="search" aria-label="Site search" onSubmit={e => e.preventDefault()}>
            <Input
              type="text"
              placeholder="Search products, categories..."
              className="w-56 transition-shadow duration-150 focus:shadow-lg"
              aria-label="Search"
            />
            <Button type="submit" variant="outline" size="sm" className="ml-2" title="Search">
              🔍
            </Button>
          </form>
          <Button variant="outline" size="sm" className="transition-transform duration-150 active:scale-95 hover:scale-105" title="Wishlist">
            <Heart size={16} /> WISHLIST (0)
          </Button>
          <Button variant="outline" size="sm" className="transition-transform duration-150 active:scale-95 hover:scale-105" title="Cart">
            <ShoppingBag size={16} /> CART
          </Button>
          <Link href="/admin/contract-management">
            <Button variant="outline" size="sm" className="transition-transform duration-150 active:scale-95 hover:scale-105" title="Temp Contracts">
              <FileText size={16} /> Temp Contracts
            </Button>
          </Link>
          <Link href="/admin/product-management">
            <Button variant="outline" size="sm" className="transition-transform duration-150 active:scale-95 hover:scale-105" title="Temp Products">
              <FileText size={16} /> Temp products
            </Button>
          </Link>
          <Link href="/supplier/contracts">
            <Button variant="outline" size="sm" className="transition-transform duration-150 active:scale-95 hover:scale-105" title="Temp Supplier">
              <Users size={16} /> Temp Supplier
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
