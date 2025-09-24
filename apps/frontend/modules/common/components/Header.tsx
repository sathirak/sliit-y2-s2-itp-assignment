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
  return (
    <header className="flex flex-col px-10 py-4 border-b">
      <div className="flex items-center gap-4">
        <Image src={BrandLogoImg} alt="Brand Logo" className="w-16 h-auto" />
        <div className="text-2xl font-bold tracking-widest">CROWNUP</div>
      </div>

      {/* Navigation and Right Side in one line */}
      <div className="flex items-center justify-between mt-2">
        <nav className="flex-1">
          <ul className="flex gap-6 font-bold text-sm mt-2">
            <li className="cursor-pointer">WOMEN </li>
            <li className="cursor-pointer">SALE</li>
            <li className="cursor-pointer">THIS WEEK</li>
            <li className="cursor-pointer">WORKWEAR</li>
            <li className="cursor-pointer">ACTIVE WEAR</li>
            <li className="cursor-pointer">LINEN</li>
            <li className="cursor-pointer">NATURAL BLENDS</li>
            <li className="cursor-pointer">DENIM</li>
            <li className="cursor-pointer">OCCASION</li>
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/my-account">
                <span className="text-sm text-gray-700 font-bold cursor-pointer hover:text-gray-900">
                  Welcome, {user.firstName || user.email}
                </span>
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="ml-2">
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <span className="text-sm text-gray-500 font-bold cursor-pointer hover:text-gray-700">
                SIGN IN
              </span>
            </Link>
          )}
          <Input
            type="text"
            placeholder="Search..."
            className="w-48"
          />
          <Button variant="outline" size="sm">
            <Heart size={16} /> WISHLIST (0)
          </Button>
          <Button variant="outline" size="sm">
            <ShoppingBag size={16} /> CART
          </Button>
          <Link href="/admin/contract-management">
            <Button variant="outline" size="sm">
              <FileText size={16} /> Temp Admin
            </Button>
          </Link>
          <Link href="/supplier/contracts">
            <Button variant="outline" size="sm">
              <Users size={16} /> Temp Supplier
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
