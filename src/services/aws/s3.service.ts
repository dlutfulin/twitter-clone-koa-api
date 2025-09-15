import dotenv from "dotenv";
dotenv.config();
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, AWS_CONFIG } from "../../shared/aws/aws.config";
import { injectable } from "tsyringe";
import * as crypto from "crypto";
import * as path from "path";

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
}

@injectable()
export class S3Service {
  private generateUniqueKey(originalName: string, folder: string = ""): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(16).toString("hex");
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    
    return folder 
      ? `${folder}/${timestamp}-${randomString}-${baseName}${extension}`
      : `${timestamp}-${randomString}-${baseName}${extension}`;
  }

  async uploadFile(
    file: Buffer, 
    originalName: string, 
    mimeType: string,
    folder: string = "uploads"
  ): Promise<UploadResult> {
    try {
      const key = this.generateUniqueKey(originalName, folder);
      console.log("Bucket:", AWS_CONFIG.S3_BUCKET);
console.log("Region:", AWS_CONFIG.REGION);
console.log("File Key:", key);
      const command = new PutObjectCommand({
        Bucket: AWS_CONFIG.S3_BUCKET,
        Key: key,
        Body: file,
        ContentType: mimeType,
      });

      await s3Client.send(command);

      const url = `https://${AWS_CONFIG.S3_BUCKET}.s3.${AWS_CONFIG.REGION}.amazonaws.com/${key}`;
      
      return {
        key,
        url,
        bucket: AWS_CONFIG.S3_BUCKET,
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  async uploadAvatar(file: Buffer, originalName: string, mimeType: string, userId: number): Promise<UploadResult> {
    return this.uploadFile(file, originalName, mimeType, `avatars/${userId}`);
  }

  async uploadPostMedia(file: Buffer, originalName: string, mimeType: string, userId: number): Promise<UploadResult> {
    return this.uploadFile(file, originalName, mimeType, `posts/${userId}`);
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: AWS_CONFIG.S3_BUCKET,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: AWS_CONFIG.S3_BUCKET,
        Key: key,
      });

      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      throw new Error(`Failed to generate signed URL: ${error}`);
    }
  }

  validateImageFile(mimeType: string, size: number): void {
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(mimeType)) {
      throw new Error("Invalid file type. Only JPEG, PNG are allowed.");
    }

    if (size > maxSize) {
      throw new Error("File size too large. Maximum size is 5MB.");
    }
  }
}