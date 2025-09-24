import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsUUID, IsBoolean } from 'class-validator';

export class UpdateContractDto {
  @ApiPropertyOptional({
    description: 'Contract title',
    example: 'Website Development Contract',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Contract description',
    example: 'Development of a corporate website with modern design',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Contract amount',
    example: '5000.00',
  })
  @IsOptional()
  @IsString()
  amount?: string;

  @ApiPropertyOptional({
    description: 'Contract start date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Contract end date',
    example: '2024-03-31',
  })
  @IsOptional()
  @IsString()
  endDate?: string;


  @ApiPropertyOptional({
    description: 'User ID for role-based access control',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'User role for role-based access control',
    enum: ['customer', 'owner', 'sales_rep', 'supplier'],
    example: 'owner',
  })
  @IsOptional()
  @IsString()
  userRole?: string;
}
