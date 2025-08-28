export const s3Config = {
  accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  endpoint: process.env.S3_ENDPOINT || '',
  region: process.env.S3_REGION || 'ap-southeast-1',
  bucketName: process.env.S3_BUCKET_NAME || 'default',
};
