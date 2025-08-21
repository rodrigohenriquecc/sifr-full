import { Router } from 'express';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const r = Router();

const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  signatureVersion: 'v4',
  region: process.env.S3_REGION || 'us-east-1'
});

r.get('/presign', async (req, res) => {
  const bucket = process.env.S3_BUCKET as string;
  const contentType = (req.query.contentType as string) || 'image/jpeg';
  const key = `photos/${uuidv4()}`;
  const params = { Bucket: bucket, Key: key, ContentType: contentType, Expires: 300 };
  try{
    const url = await s3.getSignedUrlPromise('putObject', params);
    const publicUrl = `${process.env.S3_ENDPOINT}/${bucket}/${key}`;
    res.json({ uploadUrl: url, key, publicUrl });
  }catch(e){
    res.status(500).json({ error: 'presign failed', detail: (e as Error).message });
  }
});

export default r;
