'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/modules/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/ui/card';
import { useCartStore } from '@/lib/stores/cart.store';
import { CartItemComponent } from '@/modules/common/CartItem';

export const Cart = () => {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCartStore();

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button onClick={handleContinueShopping}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button
          variant="outline"
          onClick={handleContinueShopping}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemComponent key={item.productId} item={item} />
            ))}
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              disabled={items.length === 0}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({totalItems})</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout} 
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>
              
              <div className="text-xs text-gray-500 text-center">
                Secure checkout powered by Crown Up
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};