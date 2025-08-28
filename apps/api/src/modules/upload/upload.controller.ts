import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { BucketService } from './bucket.service';
import { 
  UploadResponseDto, 
  DeleteResponseDto, 
  SignedUrlResponseDto, 
  PublicUrlResponseDto 
} from './dto/upload-response.dto';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(
    private readonly uploadService: UploadService,
    private readonly bucketService: BucketService,
  ) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload (JPG, PNG, GIF, WebP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: UploadResponseDto,
  })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const key = await this.uploadService.uploadFile(file, 'images');
      const url = await this.uploadService.getWorkingUrl(key);

      this.logger.log(`Image uploaded successfully: ${key}`);

      return {
        key,
        url,
        message: 'Image uploaded successfully',
      };
    } catch (error) {
      this.logger.error(`Error uploading image: ${error.message}`);
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  @Post('image/:folder')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload (JPG, PNG, GIF, WebP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully to specific folder',
    type: UploadResponseDto,
  })
  async uploadImageToFolder(
    @Param('folder') folder: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const key = await this.uploadService.uploadFile(file, folder);
      const url = await this.uploadService.getWorkingUrl(key);

      this.logger.log(`Image uploaded successfully to folder ${folder}: ${key}`);

      return {
        key,
        url,
        message: 'Image uploaded successfully',
      };
    } catch (error) {
      this.logger.error(`Error uploading image to folder ${folder}: ${error.message}`);
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  @Delete(':key')
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
    type: DeleteResponseDto,
  })
  async deleteImage(@Param('key') key: string) {
    try {
      await this.uploadService.deleteFile(key);
      return { message: 'Image deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting image: ${error.message}`);
      throw new BadRequestException(`Failed to delete image: ${error.message}`);
    }
  }

  @Get('url/:key')
  @ApiResponse({
    status: 200,
    description: 'Signed URL generated successfully',
    type: SignedUrlResponseDto,
  })
  async getSignedUrl(
    @Param('key') key: string,
    @Param('expiresIn') expiresIn?: string,
  ) {
    try {
      const expirationTime = expiresIn ? parseInt(expiresIn) : 3600;
      const signedUrl = await this.uploadService.getSignedUrl(key, expirationTime);
      
      return {
        signedUrl,
        expiresIn: expirationTime,
      };
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error.message}`);
      throw new BadRequestException(`Failed to generate signed URL: ${error.message}`);
    }
  }

  @Get('public/:key')
  @ApiResponse({
    status: 200,
    description: 'Working URL retrieved successfully',
    type: PublicUrlResponseDto,
  })
  async getWorkingUrl(@Param('key') key: string) {
    try {
      const workingUrl = await this.uploadService.getWorkingUrl(key);
      return { publicUrl: workingUrl };
    } catch (error) {
      this.logger.error(`Error getting working URL: ${error.message}`);
      throw new BadRequestException(`Failed to get working URL: ${error.message}`);
    }
  }

  @Post('buckets/ensure')
  @ApiResponse({
    status: 200,
    description: 'Default buckets ensured successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Success message' },
        buckets: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'List of available buckets'
        },
      },
    },
  })
  async ensureDefaultBuckets() {
    try {
      await this.bucketService.ensureDefaultBuckets();
      const buckets = await this.bucketService.listBuckets();
      
      return {
        message: 'Default buckets ensured successfully',
        buckets,
      };
    } catch (error) {
      this.logger.error(`Error ensuring buckets: ${error.message}`);
      throw new BadRequestException(`Failed to ensure buckets: ${error.message}`);
    }
  }

  @Get('buckets')
  @ApiResponse({
    status: 200,
    description: 'Buckets listed successfully',
    schema: {
      type: 'object',
      properties: {
        buckets: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'List of available buckets'
        },
      },
    },
  })
  async listBuckets() {
    try {
      const buckets = await this.bucketService.listBuckets();
      return { buckets };
    } catch (error) {
      this.logger.error(`Error listing buckets: ${error.message}`);
      throw new BadRequestException(`Failed to list buckets: ${error.message}`);
    }
  }

  @Post('buckets/:name')
  @ApiResponse({
    status: 201,
    description: 'Bucket created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Success message' },
        bucketName: { type: 'string', description: 'Name of the created bucket' },
      },
    },
  })
  async createBucket(@Param('name') name: string) {
    try {
      await this.bucketService.createBucketIfNotExists(name);
      return {
        message: 'Bucket created or already exists',
        bucketName: name,
      };
    } catch (error) {
      this.logger.error(`Error creating bucket ${name}: ${error.message}`);
      throw new BadRequestException(`Failed to create bucket: ${error.message}`);
    }
  }
}
