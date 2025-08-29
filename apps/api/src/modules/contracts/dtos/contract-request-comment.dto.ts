import { ApiProperty } from '@nestjs/swagger';

export class ContractRequestCommentDto {
  @ApiProperty({
    description: 'Comment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Comment text',
    example: 'This looks like a great opportunity! I can start next week.',
  })
  comment: string;

  @ApiProperty({
    description: 'Contract request ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  contractRequestId: string;

  @ApiProperty({
    description: 'User ID who made the comment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
