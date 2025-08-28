import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { BucketService } from './bucket.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, BucketService],
  exports: [UploadService, BucketService],
})
export class UploadModule {}
