import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Cart } from '@/lib/dtos/cart';
import type { Product } from '@/lib/dtos/product';

interface CartState extends Cart {
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price);
    return sum + (price * item.quantity);
  }, 0);
  
  return { totalItems, totalPrice };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === product.id
          );

          let newItems: CartItem[];

          if (existingItemIndex > -1) {
            // Update existing item quantity
            newItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item
            const newItem: CartItem = {
              productId: product.id,
              product,
              quantity,
              addedAt: new Date(),
            };
            newItems = [...state.items, newItem];
          }

          const { totalItems, totalPrice } = calculateTotals(newItems);

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.productId !== productId);
          const { totalItems, totalPrice } = calculateTotals(newItems);

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          );

          const { totalItems, totalPrice } = calculateTotals(newItems);

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },

      getItemQuantity: (productId: string) => {
        const item = get().items.find((item) => item.productId === productId);
        return item?.quantity || 0;
      },

      isInCart: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },
    }),
    {
      name: 'cart-storage',
      // Only persist the items array, recalculate totals on hydration
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state?.items) {
          const { totalItems, totalPrice } = calculateTotals(state.items);
          state.totalItems = totalItems;
          state.totalPrice = totalPrice;
        }
      },
    }
  )
);