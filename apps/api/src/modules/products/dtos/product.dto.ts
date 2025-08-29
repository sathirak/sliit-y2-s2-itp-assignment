import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ description: 'Product unique identifier' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Product category' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Product size' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ description: 'Product color' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ description: 'Product quantity in stock' })
  @IsNumber()
  @IsPositive()
  qty: number;

  @ApiProperty({ description: 'Product price' })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ description: 'Product image URL or path' })
  @IsString()
  @IsNotEmpty()
  product_image: string;

  @ApiProperty({ description: 'Product creation timestamp' })
  @IsDate()
  created_at: Date;

  @ApiProperty({ description: 'Soft delete flag' })
  @IsBoolean()
  deleted: boolean;
}
