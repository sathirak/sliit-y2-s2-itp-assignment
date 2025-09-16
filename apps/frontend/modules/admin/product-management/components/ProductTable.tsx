"use client";

import { Product } from "@/lib/dtos/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/ui/table";
import { Button } from "@/modules/ui/button";
import { Badge } from "@/modules/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

// Product Image component with error handling
function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isValidImageUrl = (url: string) => {
    if (!url || url.trim() === '') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (imageError || !isValidImageUrl(src)) {
    return (
      <div className="relative w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
        <div className="text-gray-400 text-xs text-center">
          <div className="w-6 h-6 mx-auto mb-1 bg-gray-300 rounded"></div>
          <div>No Image</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-16 h-16">
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-md flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-md"
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized
      />
    </div>
  );
}

export function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}: ProductTableProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(price));
  };

  const getAvailabilityBadge = (qty: number) => {
    if (qty === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (qty < 10) {
      return <Badge variant="secondary">Low Stock</Badge>;
    } else {
      return <Badge variant="default">In Stock</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <ProductImage
                    src={product.product_image || ""}
                    alt={product.name}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: product.color.toLowerCase() }}
                    />
                    <span className="capitalize">{product.color}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell>{product.qty}</TableCell>
                <TableCell>{getAvailabilityBadge(product.qty)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} products
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
