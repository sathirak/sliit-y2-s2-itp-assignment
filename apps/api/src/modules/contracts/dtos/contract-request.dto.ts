import { ApiProperty } from '@nestjs/swagger';

export class ContractRequestDto {
  @ApiProperty({
    description: 'Contract request ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Contract request title',
    example: 'Website Development Request',
  })
  title: string;

  @ApiProperty({
    description: 'Contract request description',
    example: 'Request for development of a corporate website',
  })
  description: string;

  @ApiProperty({
    description: 'Contract request amount',
    example: 5000.00,
  })
  amount: string;

  @ApiProperty({
    description: 'Contract request start date',
    example: '2024-01-01',
  })
  startDate: string;

  @ApiProperty({
    description: 'Contract request end date',
    example: '2024-03-31',
  })
  endDate: string;

  @ApiProperty({
    description: 'Contract request status',
    example: 'pending',
    enum: ['pending', 'ongoing', 'completed'],
  })
  status: string;

  @ApiProperty({
    description: 'Comment from supplier about the contract request',
    example: 'I am interested in this project and can deliver it within the timeline.',
    required: false,
  })
  comment?: string;

  @ApiProperty({
    description: 'Payment status',
    example: false,
  })
  isPaid: boolean;

  @ApiProperty({
    description: 'Owner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  ownerId: string;

  @ApiProperty({
    description: 'Supplier ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  supplierId: string;

  @ApiProperty({
    description: 'Owner approval status',
    example: false,
  })
  ownerApproved: boolean;

  @ApiProperty({
    description: 'Owner approval timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  ownerApprovedAt: Date | null;

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
