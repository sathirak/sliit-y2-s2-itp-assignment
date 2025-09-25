'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from '@/modules/ui/button';
import { useCartStore } from '@/lib/stores/cart.store';
import type { Product } from '@/lib/dtos/product';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showQuantityControls?: boolean;
}

export function AddToCartButton({ 
  product, 
  variant = 'default', 
  size = 'default',
  className,
  showQuantityControls = false
}: AddToCartButtonProps) {
  const { addItem, updateQuantity, getItemQuantity, isInCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const currentQuantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);
  
  const handleAddClick = async () => {
    setIsAdding(true);
    try {
      addItem(product, 1);
    } finally {
      setIsAdding(false);
    }
  };

  const handleIncrement = () => {
    updateQuantity(product.id, currentQuantity + 1);
  };

  const handleDecrement = () => {
    if (currentQuantity > 1) {
      updateQuantity(product.id, currentQuantity - 1);
    }
  };

  // Check if product is out of stock
  const isOutOfStock = product.qty <= 0;

  if (isOutOfStock) {
    return (
      <Button
        variant="outline"
        size={size}
        disabled
        className={cn("cursor-not-allowed", className)}
      >
        Out of Stock
      </Button>
    );
  }

  // If item is in cart and we want to show quantity controls
  if (inCart && showQuantityControls) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={currentQuantity <= 1}
        >
          <Minus />
        </Button>
        <span className="min-w-[2rem] text-center font-medium">
          {currentQuantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={currentQuantity >= product.qty}
        >
          <Plus />
        </Button>
      </div>
    );
  }

  // Simple add to cart button
  return (
    <Button
      variant={inCart ? 'secondary' : variant}
      size={size}
      onClick={handleAddClick}
      disabled={isAdding}
      className={cn(className)}
    >
      <ShoppingCart />
      {isAdding ? 'Adding...' : inCart ? 'In Cart' : 'Add to Cart'}
    </Button>
  );
}