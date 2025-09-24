"use client";

import { useState, useEffect } from "react";
import { Product, ProductFilterDto } from "@/lib/dtos/product";
import { productService } from "@/lib/services/product.service";
import { ProductTable } from "./components/ProductTable";
import { ProductFilters } from "./components/ProductFilters";
import { ProductDialog } from "./components/ProductDialog";
import { Button } from "@/modules/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/ui/card";
import { Plus, Package, Download } from "lucide-react";
import { downloadProductReport } from "@/lib/utils/report.utils";

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilterDto>({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [downloadingReport, setDownloadingReport] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts(filters);
      setProducts(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        await fetchProducts();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete product");
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleProductSaved = () => {
    handleDialogClose();
    fetchProducts();
  };

  const handleFilterChange = (newFilters: Partial<ProductFilterDto>) => {
    // If it's an empty object (clear filters), reset to defaults
    if (Object.keys(newFilters).length === 0) {
      setFilters({
        page: 1,
        limit: 10,
      });
    } else {
      setFilters(prev => ({
        ...prev,
        ...newFilters,
        page: 1, // Reset to first page when filters change
      }));
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDownloadReport = async () => {
    setDownloadingReport(true);
    try {
      const allProducts = await productService.getAllProducts();
      downloadProductReport(allProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download report");
    } finally {
      setDownloadingReport(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground">
              Manage your product inventory and details
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleDownloadReport}
            disabled={downloadingReport}
            className="flex items-center space-x-2"
          >
            {downloadingReport ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{downloadingReport ? 'Downloading...' : 'Download Report'}</span>
          </Button>
          <Button onClick={handleCreateProduct} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            View and manage all products in your inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <ProductTable
            products={products}
            loading={loading}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        product={editingProduct}
        onSaved={handleProductSaved}
      />
    </div>
  );
}
