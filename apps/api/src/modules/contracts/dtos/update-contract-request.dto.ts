import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateContractRequestDto {
  @ApiPropertyOptional({
    description: 'Contract request status',
    example: 'ongoing',
    enum: ['pending', 'ongoing', 'completed'],
  })
  @IsOptional()
  @IsString()
  status?: 'pending' | 'ongoing' | 'completed';

  @ApiPropertyOptional({
    description: 'Comment from supplier about the contract request',
    example: 'I am interested in this project and can deliver it within the timeline.',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({
    description: 'Payment status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

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
