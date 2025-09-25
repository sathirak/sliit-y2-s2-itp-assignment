'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/modules/ui/button';
import { Badge } from '@/modules/ui/badge';
import { useCartStore } from '@/lib/stores/cart.store';
import { cn } from '@/lib/utils';

interface CartIconProps {
  className?: string;
  onClick?: () => void;
}

export function CartIcon({ className, onClick }: CartIconProps) {
  const { totalItems } = useCartStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      onClick={onClick}
    >
      <ShoppingCart />
      {totalItems > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
    </Button>
  );
}