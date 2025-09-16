# Admin Product Management

This module provides a comprehensive product management interface for administrators.

## Features

- **Product Listing**: View all products in a paginated table with filtering and search capabilities
- **Product Creation**: Add new products with detailed information
- **Product Editing**: Update existing product details
- **Product Deletion**: Remove products from the system
- **Advanced Filtering**: Filter products by category, size, color, price range, quantity, and availability
- **Search**: Search products by name, description, or category
- **Responsive Design**: Works on desktop and mobile devices

## Components

### ProductManagement
Main component that orchestrates the entire product management interface.

### ProductTable
Displays products in a table format with:
- Product images with placeholder fallback
- Product details (name, category, size, color, price, quantity)
- Availability status badges
- Action buttons for edit and delete operations
- Pagination controls

### ProductFilters
Advanced filtering interface with:
- Text search
- Category dropdown
- Size selection
- Color selection
- Price range inputs
- Quantity range inputs
- Availability filter

### ProductDialog
Modal dialog for creating and editing products with:
- Form validation
- All product fields
- Image URL input
- Loading states
- Error handling

## API Integration

The module integrates with the backend API endpoints:
- `GET /products` - List products with filtering and pagination
- `GET /products/:id` - Get single product
- `POST /products` - Create new product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## Usage

Navigate to `/admin/product-management` to access the product management interface. The admin link is available in the main header.

## Dependencies

- shadcn/ui components (Table, Card, Dialog, Form, etc.)
- Lucide React icons
- Next.js Image component
- Custom product service for API communication
