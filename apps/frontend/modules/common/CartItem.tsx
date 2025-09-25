'use client';

import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/modules/ui/button';
import { Card, CardContent } from '@/modules/ui/card';
import { useCartStore } from '@/lib/stores/cart.store';
import type { CartItem } from '@/lib/dtos/cart';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItem;
  className?: string;
  showImage?: boolean;
}

export function CartItemComponent({ item, className, showImage = true }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;
  
  const price = parseFloat(product.price);
  const totalPrice = price * quantity;

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
  };

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {showImage && (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={product.product_image || '/placeholder-image.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 space-y-1">
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
            <div className="text-sm text-muted-foreground">
              <span>{product.category}</span>
              {product.size && <span className="ml-2">Size: {product.size}</span>}
              {product.color && <span className="ml-2">Color: {product.color}</span>}
            </div>
            <div className="text-sm font-medium">
              ${price.toFixed(2)} each
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="min-w-[2rem] text-center font-medium">
              {quantity}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={quantity >= product.qty}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-right">
            <div className="font-medium">
              ${totalPrice.toFixed(2)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive/90 h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}