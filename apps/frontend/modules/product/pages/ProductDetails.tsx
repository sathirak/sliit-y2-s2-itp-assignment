'use client';

import React from "react";
import Image from "next/image";
import { useProduct } from "@/lib/hooks/useProducts";
import { Badge } from "@/modules/ui/badge";
import { AddToCartButton } from "@/modules/common/AddToCartButton";

interface ProductDetailsProps {
  id: string;
}

export const ProductDetails = ({ id }: ProductDetailsProps) => {
  const { product, isLoading, error } = useProduct(id);

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
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p>The product you're looking for could not be found.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div className="w-full h-96 lg:h-[600px] bg-gray-300 animate-pulse rounded"></div>
          
          {/* Details skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-300 animate-pulse rounded"></div>
            <div className="h-6 bg-gray-300 animate-pulse rounded w-3/4"></div>
            <div className="h-10 bg-gray-300 animate-pulse rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
            <div className="h-20 bg-gray-300 animate-pulse rounded"></div>
            <div className="space-y-2">
              <div className="h-12 bg-gray-300 animate-pulse rounded"></div>
              <div className="h-12 bg-gray-300 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center text-gray-500">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p>The product you're looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="w-full">
          <div className="w-full h-96 lg:h-[600px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.product_image}
              alt={product.name}
              width={600}
              height={600}
              className="object-cover h-full w-full hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
              }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Product Name */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          {/* Category and Details */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-sm">
              {product.category}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Size: {product.size}
            </Badge>
            <Badge variant="outline" className="text-sm flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: product.color.toLowerCase() }}
              />
              {product.color}
            </Badge>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-3xl lg:text-4xl font-bold text-gray-900">
              Rs. {formatPrice(product.price)}
            </div>
            <div className="text-lg text-gray-600">
              or 3 x{" "}
              <span className="font-semibold">
                Rs. {calculateInstallment(product.price)}
              </span>{" "}
              with{" "}
              <span className="font-bold">intpay</span>
            </div>
          </div>

          {/* Stock Status */}
          <div className="text-lg">
            {product.qty > 0 ? (
              <span className="text-green-600 font-semibold">
                ✓ {product.qty} in stock
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                ✗ Out of stock
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4">
            <AddToCartButton 
              product={product} 
              className="w-full py-4 px-6 text-lg"
              size="lg"
              showQuantityControls={true}
            />
          </div>

          {/* Additional Info */}
          <div className="pt-6 border-t border-gray-200">
            <div className="text-center text-gray-500">
              <div className="text-sm font-medium">CROWNUP</div>
              <div className="text-xs mt-1">Premium Quality Fashion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
