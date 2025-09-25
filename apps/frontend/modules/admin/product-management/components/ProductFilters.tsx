"use client";

import { ProductFilterDto } from "@/lib/dtos/product";
import { Input } from "@/modules/ui/input";
import { Button } from "@/modules/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, SIZES, COLORS } from "@/lib/constants/categories";

interface ProductFiltersProps {
  filters: ProductFilterDto;
  onFilterChange: (filters: Partial<ProductFilterDto>) => void;
}


export function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Partial<ProductFilterDto>>({
    search: filters.search || "",
    category: filters.category || "all",
    size: filters.size || "all",
    color: filters.color || "all",
    minPrice: filters.minPrice || "",
    maxPrice: filters.maxPrice || "",
    minQty: filters.minQty || "",
    maxQty: filters.maxQty || "",
    availability: filters.availability || "all",
  });

  const handleFilterChange = (key: keyof ProductFilterDto, value: string | number) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([_, value]) => 
        value !== "" && value !== null && value !== undefined && value !== "all"
      )
    );
    onFilterChange(cleanFilters);
  };

  const clearFilters = () => {
    setLocalFilters({
      search: "",
      category: "all",
      size: "all",
      color: "all",
      minPrice: "",
      maxPrice: "",
      minQty: "",
      maxQty: "",
      availability: "all",
    });
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(localFilters).some(
    value => value !== "" && value !== null && value !== undefined && value !== "all"
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={localFilters.category}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Size</label>
          <Select
            value={localFilters.size}
            onValueChange={(value) => handleFilterChange("size", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All sizes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sizes</SelectItem>
              {SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Color</label>
          <Select
            value={localFilters.color}
            onValueChange={(value) => handleFilterChange("color", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All colors</SelectItem>
              {COLORS.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Min Price</label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={localFilters.minPrice}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Allow empty string or valid positive numbers only
              if (inputValue === "" || (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0)) {
                const value = inputValue === "" ? "" : parseInt(inputValue);
                handleFilterChange("minPrice", value);
              }
            }}
            onKeyPress={(e) => {
              // Only allow numbers, backspace, delete, tab, escape, enter
              if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Max Price</label>
          <Input
            type="number"
            min="0"
            placeholder="1000"
            value={localFilters.maxPrice}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Allow empty string or valid positive numbers only
              if (inputValue === "" || (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0)) {
                const value = inputValue === "" ? "" : parseInt(inputValue);
                handleFilterChange("maxPrice", value);
              }
            }}
            onKeyPress={(e) => {
              // Only allow numbers, backspace, delete, tab, escape, enter
              if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>

        {/* Quantity Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Min Quantity</label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            value={localFilters.minQty}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Allow empty string or valid positive numbers only
              if (inputValue === "" || (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0)) {
                const value = inputValue === "" ? "" : parseInt(inputValue);
                handleFilterChange("minQty", value);
              }
            }}
            onKeyPress={(e) => {
              // Only allow numbers, backspace, delete, tab, escape, enter
              if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Max Quantity</label>
          <Input
            type="number"
            min="0"
            placeholder="100"
            value={localFilters.maxQty}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Allow empty string or valid positive numbers only
              if (inputValue === "" || (/^\d+$/.test(inputValue) && parseInt(inputValue) >= 0)) {
                const value = inputValue === "" ? "" : parseInt(inputValue);
                handleFilterChange("maxQty", value);
              }
            }}
            onKeyPress={(e) => {
              // Only allow numbers, backspace, delete, tab, escape, enter
              if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Availability</label>
          <Select
            value={localFilters.availability}
            onValueChange={(value) => handleFilterChange("availability", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex items-center space-x-2"
          disabled={!hasActiveFilters}
        >
          <X className="h-4 w-4" />
          <span>Clear Filters</span>
        </Button>
        <Button onClick={applyFilters} className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Apply Filters</span>
        </Button>
      </div>
    </div>
  );
}
