// components/Header.js
import { Heart, ShoppingBag, ChevronDown } from "lucide-react";

export const Header = () => {
  return (
// ...existing code...
<header className="flex flex-col px-10 py-4 border-b">
  {/* Logo */}
  <div className="text-2xl font-bold tracking-widest">CROWNUP</div>

  {/* Navigation */}
  <nav className="flex-1 mt-2">
    <div className="flex flex-col">
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
    </div>
  </nav>

  {/* Right Side */}
  <div className="flex items-center gap-4 mt-4 self-end">
    <span className="text-sm text-gray-500 font-bold cursor-pointer">
      SIGN IN
    </span>
    <input
      type="text"
      placeholder="Search..."
      className="border rounded px-3 py-1 text-sm"
    />
    <button className="border rounded px-3 py-1 flex items-center gap-2 font-bold text-sm">
      <Heart size={16} /> WISHLIST (0)
    </button>
    <button className="border rounded px-3 py-1 flex items-center gap-2 font-bold text-sm">
      <ShoppingBag size={16} /> CART
    </button>
  </div>
</header>
//
  );
}
