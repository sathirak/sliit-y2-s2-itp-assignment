"use client";

import { useState, useEffect, useRef } from "react";
import { Product, CreateProductDto, UpdateProductDto } from "@/lib/dtos/product";
import { productService } from "@/lib/services/product.service";
import { uploadService } from "@/lib/services/upload.service";
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
import { Loader2, Upload, X, AlertCircle } from "lucide-react";
import { PRODUCT_CATEGORIES, SIZES, COLORS } from "@/lib/constants/categories";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSaved: () => void;
}


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
  
  // Keep quantity as string for better input handling
  const [qtyInput, setQtyInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        category: normalizeValue(product.category, PRODUCT_CATEGORIES),
        description: product.description,
        size: normalizeValue(product.size, SIZES),
        color: normalizeValue(product.color, COLORS),
        qty: product.qty,
        price: product.price,
        product_image: product.product_image,
      });
      setQtyInput(product.qty.toString());
      setShowUrlInput(!!product.product_image); // Show URL input if editing and has image
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
      setQtyInput("");
      setShowUrlInput(false);
    }
    setError(null);
    setUploadError(null);
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert qtyInput to number for submission
      const submissionData = {
        ...formData,
        qty: parseInt(qtyInput) || 0,
      };

      if (isEditing && product) {
        const updateData: UpdateProductDto = { ...submissionData };
        await productService.updateProduct(product.id, updateData);
      } else {
        await productService.createProduct(submissionData);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setUploadError(null);

    try {
      const response = await uploadService.uploadImage(file);
      handleInputChange('product_image', response.url);
      setShowUrlInput(false); // Hide URL input on successful upload
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
      setShowUrlInput(true); // Show URL input as fallback
    } finally {
      setUploadingImage(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    handleInputChange('product_image', '');
    setShowUrlInput(false);
    setUploadError(null);
  };

  const handleShowUrlInput = () => {
    setShowUrlInput(true);
    setUploadError(null);
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
                  {PRODUCT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  {/* Show current value if it's not in the list */}
                  {formData.category && !PRODUCT_CATEGORIES.includes(formData.category) && (
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
                value={qtyInput}
                onChange={(e) => setQtyInput(e.target.value)}
                placeholder="Enter quantity"
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
          <div className="space-y-4">
            <Label>Product Image</Label>
            
            {/* Image Preview */}
            {formData.product_image && (
              <div className="relative inline-block">
                <img
                  src={formData.product_image}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemoveImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Upload Error */}
            {uploadError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Upload Buttons */}
            <div className="flex flex-wrap gap-2">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center space-x-2"
                >
                  {uploadingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                </Button>
              </div>
              
              <Button
                type="button"
                variant="ghost"
                onClick={handleShowUrlInput}
                className="text-sm"
              >
                Or enter URL
              </Button>
            </div>

            {/* URL Input (fallback) */}
            {showUrlInput && (
              <div className="space-y-2">
                <Label htmlFor="product_image_url">Image URL</Label>
                <Input
                  id="product_image_url"
                  value={formData.product_image}
                  onChange={(e) => handleInputChange("product_image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
            
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB.
            </p>
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
