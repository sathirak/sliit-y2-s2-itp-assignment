import { ApiProperty } from '@nestjs/swagger';

export class ContractDto {
  @ApiProperty({
    description: 'Contract ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Contract title',
    example: 'Website Development Contract',
  })
  title: string;

  @ApiProperty({
    description: 'Contract description',
    example: 'Development of a corporate website with modern design',
  })
  description: string;

  @ApiProperty({
    description: 'Contract amount',
    example: 5000.00,
  })
  amount: string;

  @ApiProperty({
    description: 'Contract start date',
    example: '2024-01-01',
  })
  startDate: string;

  @ApiProperty({
    description: 'Contract end date',
    example: '2024-03-31',
  })
  endDate: string;

  @ApiProperty({
    description: 'Owner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  ownerId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
