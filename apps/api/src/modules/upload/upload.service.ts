import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Config } from '../../config/s3.config';
import { BucketService } from './bucket.service';

@Injectable()
export class UploadService implements OnModuleInit {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly bucketService: BucketService) {
    this.s3Client = new S3Client({
      region: s3Config.region,
      endpoint: s3Config.endpoint,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    // Ensure default buckets exist when the module initializes
    try {
      await this.bucketService.ensureDefaultBuckets();
      this.logger.log('Default buckets ensured on module initialization');
    } catch (error) {
      this.logger.warn('Failed to ensure default buckets on initialization:', error.message);
    }
  }

  async uploadFile(file: Express.Multer.File, folder?: string): Promise<string> {
    try {
      // Ensure the bucket exists before upload
      await this.bucketService.createBucketIfNotExists(s3Config.bucketName);
      
      const key = folder ? `${folder}/${Date.now()}-${file.originalname}` : `${Date.now()}-${file.originalname}`;
      
      const command = new PutObjectCommand({
        Bucket: s3Config.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);
      
      this.logger.log(`File uploaded successfully: ${key}`);
      return key;
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: s3Config.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: s3Config.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error.message}`);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  // Simple method to get a working URL for the uploaded image
  async getWorkingUrl(key: string): Promise<string> {
    // Return a signed URL that expires in 7 days (maximum allowed for S3)
    return this.getSignedUrl(key, 7 * 24 * 60 * 60);
  }
}
