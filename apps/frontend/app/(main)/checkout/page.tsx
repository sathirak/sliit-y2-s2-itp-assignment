"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/ui/card';
import { Button } from '@/modules/ui/button';
import { Input } from '@/modules/ui/input';
import { Label } from '@/modules/ui/label';
import { 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  ShoppingBag,
  ArrowLeft,
  Lock,
  Shield,
  CheckCircle
} from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart.store';
import { useOrderMutations } from '@/lib/hooks/useOrders';
import { usePaymentMutations } from '@/lib/hooks/usePayments';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { CartItemComponent } from '@/modules/common/CartItem';
import type { 
  CreateOrderDto, 
  CreateOrderProductItemDto, 
  OrderStatus,
  PaymentMethod,
  CreatePaymentDto,
  PaymentStatus 
} from '@/lib/dtos/order';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { createOrder } = useOrderMutations();
  const { makePayment } = usePaymentMutations();
  const { user } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Contact Information
    email: user?.email || '',
    phone: '',
    
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card' as PaymentMethod);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/cart');
    }
  }, [items.length, orderComplete, router]);

  const subtotal = totalPrice;
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Prepare order data
      const orderProducts: CreateOrderProductItemDto[] = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      }));

      const orderData: CreateOrderDto = {
        status: 'pending' as OrderStatus,
        customerId: user?.id || undefined,
        products: orderProducts
      };

      // Create the order
      const orderResponse = await createOrder(orderData);
      
      // Create payment if Card or PayPal (digital_wallet) is selected
      if (paymentMethod === 'card' || paymentMethod === 'digital_wallet') {
        // For now, assume invoice is created automatically with order
        // In a real implementation, you'd get the invoice ID from the order response
        const paymentData: CreatePaymentDto = {
          invoiceId: orderResponse.id, // Using order ID as invoice ID for now
          amount: total.toFixed(2),
          method: paymentMethod,
          status: 'completed' as PaymentStatus
        };
        
        try {
          await makePayment(paymentData);
        } catch (paymentError) {
          console.error('Failed to create payment:', paymentError);
          // Continue with order completion even if payment creation fails for logging
        }
      }
      
      setOrderId(orderResponse.id);
      setOrderComplete(true);
      
      // Clear the cart
      clearCart();
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show order confirmation
  if (orderComplete && orderId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully. Order ID: <strong>{orderId}</strong>
            </p>
            <div className="space-y-4">
              <Button onClick={() => router.push('/')} className="w-full">
                Continue Shopping
              </Button>
              <Button 
                onClick={() => router.push('/my-account')} 
                variant="outline" 
                className="w-full"
              >
                View Order History
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4 p-0 h-auto"
            onClick={() => router.push('/cart')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail size={20} />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard size={20} />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Payment Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card' as PaymentMethod)}
                      className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        paymentMethod === 'card' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard size={16} />
                      Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('digital_wallet' as PaymentMethod)}
                      className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        paymentMethod === 'digital_wallet' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      PayPal
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer' as PaymentMethod)}
                      className={`p-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        paymentMethod === 'bank_transfer' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Bank Transfer
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            type="text"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input
                          id="nameOnCard"
                          type="text"
                          value={formData.nameOnCard}
                          onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'digital_wallet' && (
                    <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-gray-600">You'll be redirected to PayPal to complete your purchase</p>
                    </div>
                  )}

                  {paymentMethod === 'bank_transfer' && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-600">Bank transfer details will be provided after order confirmation</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag size={20} />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <CartItemComponent 
                        key={item.productId} 
                        item={item} 
                        showImage={false}
                        className="border-0 shadow-none"
                      />
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="space-y-3 mb-6 border-t pt-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Shield size={16} className="text-green-600" />
                    <p className="text-sm text-green-700">
                      Your payment information is secured with 256-bit SSL encryption
                    </p>
                  </div>

                  {/* Complete Order Button */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-12 text-lg font-semibold"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock size={16} />
                        Complete Order - ${total.toFixed(2)}
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    By placing your order, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}