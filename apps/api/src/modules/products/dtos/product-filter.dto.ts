import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ProductFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by product category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by product size',
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({
    description: 'Filter by product color',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    description: 'Filter by minimum price',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum price',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Filter by minimum quantity in stock',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minQty?: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum quantity in stock',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxQty?: number;

  @ApiPropertyOptional({
    description: 'Filter by availability (in stock or out of stock)',
    enum: ['in_stock', 'out_of_stock'],
  })
  @IsOptional()
  @IsString()
  availability?: 'in_stock' | 'out_of_stock';
}
