import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateContractRequestDto {
  @ApiProperty({
    description: 'Contract request title',
    example: 'Website Development Request',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Contract request description',
    example: 'Request for development of a corporate website',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Contract request amount',
    example: '5000.00',
  })
  @IsString()
  amount: string;

  @ApiProperty({
    description: 'Contract request start date',
    example: '2024-01-01',
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    description: 'Contract request end date',
    example: '2024-03-31',
  })
  @IsString()
  endDate: string;

  @ApiProperty({
    description: 'Owner ID (from the original contract)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  ownerId: string;

  @ApiProperty({
    description: 'Comment from supplier about the contract request',
    example: 'I am interested in this project and can deliver it within the timeline.',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
