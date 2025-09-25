'use client';

import React from "react";
import Image from "next/image";
import { useNewArrivals } from "@/lib/hooks/useProducts";
import { AddToCartButton } from "@/modules/common/AddToCartButton";

export const NewArrivals = () => {
  const { products, isLoading, error } = useNewArrivals(8);

  // Helper function to calculate installment price
  const calculateInstallment = (price: string) => {
    const numPrice = parseFloat(price);
    return (numPrice / 3).toFixed(2);
  };

  // Helper function to format price for display
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  if (error) {
    return (
      <section className="max-w-6xl mx-auto py-10">
        <h2 className="text-3xl font-semibold text-center mb-2 tracking-wide">
          NEW ARRIVALS
        </h2>
        <div className="flex justify-center mb-8">
          <span className="block w-16 h-1 bg-black"></span>
        </div>
        <div className="text-center text-red-500">
          Failed to load products. Please try again later.
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto py-10">
        <h2 className="text-3xl font-semibold text-center mb-2 tracking-wide">
          NEW ARRIVALS
        </h2>
        <div className="flex justify-center mb-8">
          <span className="block w-16 h-1 bg-black"></span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white shadow rounded overflow-hidden flex flex-col items-center animate-pulse"
            >
              <div className="w-full h-96 bg-gray-300"></div>
              <div className="p-4 w-full text-center">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section className="max-w-6xl mx-auto py-10">
      <h2 className="text-3xl font-semibold text-center mb-2 tracking-wide">
        NEW ARRIVALS
      </h2>
      <div className="flex justify-center mb-8">
        <span className="block w-16 h-1 bg-black"></span>
      </div>
      {products.length === 0 ? (
        <div className="text-center text-gray-500">
          No products available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded overflow-hidden flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-full h-96 flex items-center justify-center bg-gray-100">
                <Image
                  src={product.product_image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-cover h-full w-full"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />
              </div>
              <div className="p-4 w-full text-center">
                <div className="text-lg font-medium mb-1 line-clamp-2">
                  {product.name}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {product.category} • {product.size} • {product.color}
                </div>
                <div className="text-2xl font-bold mb-1">
                  Rs. {formatPrice(product.price)}
                </div>
                <div className="text-sm mb-2">
                  or 3 x{" "}
                  <span className="font-semibold">
                    Rs. {calculateInstallment(product.price)}
                  </span>{" "}
                  with{" "}
                  <span className="font-bold">intpay</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  {product.qty > 0 ? (
                    <span className="text-green-600">
                      {product.qty} in stock
                    </span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </div>
                <AddToCartButton 
                  product={product} 
                  size="sm" 
                  className="w-full mb-2"
                />
                <div className="text-xs text-gray-400 mt-2">CROWNUP</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};