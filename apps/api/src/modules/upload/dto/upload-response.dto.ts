import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'File key in S3 storage',
    example: 'images/1703123456789-example.jpg',
  })
  key: string;

  @ApiProperty({
    description: 'Working URL of the uploaded image (signed URL that works)',
    example: 'https://fcwuatyclrkywpvycrji.storage.supabase.co/storage/v1/s3/images/1703123456789-example.jpg?X-Amz-Algorithm=...',
  })
  url: string;

  @ApiProperty({
    description: 'Success message',
    example: 'Image uploaded successfully',
  })
  message: string;
}

export class DeleteResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Image deleted successfully',
  })
  message: string;
}

export class SignedUrlResponseDto {
  @ApiProperty({
    description: 'Signed URL for the image',
    example: 'https://fcwuatyclrkywpvycrji.storage.supabase.co/storage/v1/s3/images/example.jpg?X-Amz-Algorithm=...',
  })
  signedUrl: string;

  @ApiProperty({
    description: 'URL expiration time in seconds',
    example: 3600,
  })
  expiresIn: number;
}

export class PublicUrlResponseDto {
  @ApiProperty({
    description: 'Working URL of the image (signed URL that works)',
    example: 'https://fcwuatyclrkywpvycrji.storage.supabase.co/storage/v1/s3/images/example.jpg?X-Amz-Algorithm=...',
  })
  publicUrl: string;
}
