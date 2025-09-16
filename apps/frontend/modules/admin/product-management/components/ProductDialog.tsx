"use client";

import { useState, useEffect } from "react";
import { Product, CreateProductDto, UpdateProductDto } from "@/lib/services/dtos/product";
import { productService } from "@/lib/services/product.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/ui/dialog";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Textarea } from "@/modules/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/ui/select";
import { Loader2 } from "lucide-react";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSaved: () => void;
}

const CATEGORIES = [
  "T-Shirts",
  "Jeans",
  "Dresses",
  "Sweaters",
  "Jackets",
  "Shoes",
  "Accessories",
  "Home",
  "Electronics",
  "Clothing",
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Standard", "One-Size", "32", "34", "36", "38", "40", "42"];

const COLORS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Purple",
  "Orange",
  "Brown",
  "Gray",
];

export function ProductDialog({ open, onOpenChange, product, onSaved }: ProductDialogProps) {
  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    category: "",
    description: "",
    size: "",
    color: "",
    qty: 0,
    price: "",
    product_image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!product;

  // Normalize values to match the options arrays
  const normalizeValue = (value: string, options: string[]) => {
    if (!value) return "";
    // First try exact match
    if (options.includes(value)) return value;
    // Then try case-insensitive match
    const lowerValue = value.toLowerCase();
    const match = options.find(option => option.toLowerCase() === lowerValue);
    return match || value; // Return original if no match found
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: normalizeValue(product.category, CATEGORIES),
        description: product.description,
        size: normalizeValue(product.size, SIZES),
        color: normalizeValue(product.color, COLORS),
        qty: product.qty,
        price: product.price,
        product_image: product.product_image,
      });
    } else {
      setFormData({
        name: "",
        category: "",
        description: "",
        size: "",
        color: "",
        qty: 0,
        price: "",
        product_image: "",
      });
    }
    setError(null);
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && product) {
        const updateData: UpdateProductDto = { ...formData };
        await productService.updateProduct(product.id, updateData);
      } else {
        await productService.createProduct(formData);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateProductDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Create New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the product information below."
              : "Fill in the details to create a new product."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  {/* Show current value if it's not in the list */}
                  {formData.category && !CATEGORIES.includes(formData.category) && (
                    <SelectItem key={formData.category} value={formData.category}>
                      {formData.category}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <Label htmlFor="size">Size *</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => handleInputChange("size", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                  {/* Show current value if it's not in the list */}
                  {formData.size && !SIZES.includes(formData.size) && (
                    <SelectItem key={formData.size} value={formData.size}>
                      {formData.size}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => handleInputChange("color", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                  {/* Show current value if it's not in the list */}
                  {formData.color && !COLORS.includes(formData.color) && (
                    <SelectItem key={formData.color} value={formData.color}>
                      {formData.color}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="qty">Quantity *</Label>
              <Input
                id="qty"
                type="number"
                min="0"
                value={formData.qty}
                onChange={(e) => handleInputChange("qty", parseInt(e.target.value) || 0)}
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter product description"
              rows={3}
              required
            />
          </div>

          {/* Product Image */}
          <div className="space-y-2">
            <Label htmlFor="product_image">Product Image URL (temp)</Label>
            <Input
              id="product_image"
              value={formData.product_image}
              onChange={(e) => handleInputChange("product_image", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
