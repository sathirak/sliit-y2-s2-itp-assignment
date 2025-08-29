import { Injectable, Logger } from '@nestjs/common';
import { S3Client, CreateBucketCommand, HeadBucketCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { s3Config } from '../../config/s3.config';

@Injectable()
export class BucketService {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(BucketService.name);

  constructor() {
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

  async createBucketIfNotExists(bucketName: string): Promise<void> {
    try {
      // Check if bucket exists
      const headCommand = new HeadBucketCommand({ Bucket: bucketName });
      await this.s3Client.send(headCommand);
      this.logger.log(`Bucket ${bucketName} already exists`);
    } catch (error) {
      if (error.name === 'NotFound' || error.name === 'NoSuchBucket') {
        // Bucket doesn't exist, create it
        try {
          const createCommand = new CreateBucketCommand({ 
            Bucket: bucketName,
            ACL: 'public-read',
          });
          await this.s3Client.send(createCommand);
          this.logger.log(`Bucket ${bucketName} created successfully`);
        } catch (createError) {
          this.logger.error(`Failed to create bucket ${bucketName}: ${createError.message}`);
          throw new Error(`Failed to create bucket: ${createError.message}`);
        }
      } else {
        this.logger.error(`Error checking bucket ${bucketName}: ${error.message}`);
        throw new Error(`Error checking bucket: ${error.message}`);
      }
    }
  }

  async listBuckets(): Promise<string[]> {
    try {
      const command = new ListBucketsCommand({});
      const response = await this.s3Client.send(command);
      const bucketNames = response.Buckets?.map(bucket => bucket.Name) || [];
      this.logger.log(`Available buckets: ${bucketNames.join(', ')}`);
      return bucketNames;
    } catch (error) {
      this.logger.error(`Error listing buckets: ${error.message}`);
      throw new Error(`Failed to list buckets: ${error.message}`);
    }
  }

  async ensureDefaultBuckets(): Promise<void> {
    const defaultBuckets = ['default', 'images', 'products', 'avatars'];
    
    for (const bucketName of defaultBuckets) {
      try {
        await this.createBucketIfNotExists(bucketName);
      } catch (error) {
        this.logger.warn(`Failed to create bucket ${bucketName}: ${error.message}`);
      }
    }
  }
}
