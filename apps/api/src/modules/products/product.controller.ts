import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductDto } from './dtos/product.dto';
import { ProductFilterDto } from './dtos/product-filter.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { AllowGuests } from '../../common/decorates/allow-guests.decorator';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin access required' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @AllowGuests()
  @ApiOperation({ summary: 'Get all products with pagination, search, and filtering' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (1-100)', example: 10 })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for name, description, or category' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'size', required: false, description: 'Filter by size' })
  @ApiQuery({ name: 'color', required: false, description: 'Filter by color' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'minQty', required: false, description: 'Minimum quantity filter' })
  @ApiQuery({ name: 'maxQty', required: false, description: 'Maximum quantity filter' })
  @ApiQuery({ name: 'availability', required: false, description: 'Availability filter', enum: ['in_stock', 'low_stock', 'out_of_stock'] })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of products',
    type: PaginatedResponseDto,
  })
  findAll(@Query() filters: ProductFilterDto): Promise<PaginatedResponseDto<ProductDto>> {
    return this.productService.findAll(filters);
  }

  @Get('all')
  @AllowGuests()
  @ApiOperation({ summary: 'Get all products without pagination (for backward compatibility)' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: [ProductDto],
  })
  findAllSimple() {
    return this.productService.findAllSimple();
  }

  @Get(':id')
  @AllowGuests()
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    type: ProductDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin access required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Admin access required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
