import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString, IsUUID, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ContractFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'User ID for role-based access control',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'User role for role-based access control',
    enum: ['customer', 'owner', 'sales_rep', 'supplier'],
  })
  @IsOptional()
  @IsString()
  userRole?: string;
  @ApiPropertyOptional({
    description: 'Filter by contract title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by contract status',
    enum: ['pending', 'active', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsString()
  status?: 'pending' | 'active' | 'completed' | 'cancelled';

  @ApiPropertyOptional({
    description: 'Filter by payment status',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPaid?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by owner ID',
  })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'Filter by supplier ID',
  })
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @ApiPropertyOptional({
    description: 'Filter by minimum amount',
  })
  @IsOptional()
  @IsString()
  minAmount?: string;

  @ApiPropertyOptional({
    description: 'Filter by maximum amount',
  })
  @IsOptional()
  @IsString()
  maxAmount?: string;

  @ApiPropertyOptional({
    description: 'Filter by start date from',
  })
  @IsOptional()
  @IsString()
  startDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter by start date to',
  })
  @IsOptional()
  @IsString()
  startDateTo?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date from',
  })
  @IsOptional()
  @IsString()
  endDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date to',
  })
  @IsOptional()
  @IsString()
  endDateTo?: string;
}
