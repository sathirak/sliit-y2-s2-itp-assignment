import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDateString, IsUUID } from 'class-validator';

export class CreateContractDto {
  @ApiProperty({
    description: 'Contract title',
    example: 'Website Development Contract',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Contract description',
    example: 'Development of a corporate website with modern design',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Contract amount',
    example: '5000.00',
  })
  @IsString()
  amount: string;

  @ApiProperty({
    description: 'Contract start date',
    example: '2024-01-01',
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    description: 'Contract end date',
    example: '2024-03-31',
  })
  @IsString()
  endDate: string;


  @ApiProperty({
    description: 'User ID for role-based access control',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'User role for role-based access control',
    enum: ['customer', 'owner', 'sales_rep', 'supplier'],
    example: 'owner',
  })
  @IsString()
  @IsNotEmpty()
  userRole: string;
}
