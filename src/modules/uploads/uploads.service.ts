import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { CreateUploadUrlDto } from "./dto/create-upload-url.dto";

@Injectable()
export class UploadsService {
  private readonly bucket: string;
  private readonly publicBaseUrl?: string;
  private readonly s3Client: S3Client;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    this.bucket = configService.get<string>("AWS_S3_BUCKET", "");
    this.publicBaseUrl = configService.get<string>("AWS_PUBLIC_BASE_URL");

    this.s3Client = new S3Client({
      region: configService.get<string>("AWS_REGION", "ap-southeast-1"),
      credentials:
        configService.get<string>("AWS_ACCESS_KEY_ID") &&
        configService.get<string>("AWS_SECRET_ACCESS_KEY")
          ? {
              accessKeyId: configService.get<string>("AWS_ACCESS_KEY_ID", ""),
              secretAccessKey: configService.get<string>("AWS_SECRET_ACCESS_KEY", "")
            }
          : undefined
    });
  }

  async createPresignedUpload(body: CreateUploadUrlDto) {
    if (!this.bucket) {
      throw new InternalServerErrorException(
        "S3 chưa được cấu hình. Hãy bổ sung AWS_S3_BUCKET trong .env."
      );
    }

    const safeFilename = body.filename.replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const folder = body.folder?.trim() || "products";
    const key = `${folder}/${randomUUID()}-${safeFilename}`;

    if (!body.contentType.startsWith("image/")) {
      throw new BadRequestException("Chỉ hỗ trợ upload hình ảnh.");
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: body.contentType
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300
    });

    return {
      uploadUrl,
      key,
      fileUrl: this.publicBaseUrl
        ? `${this.publicBaseUrl.replace(/\/$/, "")}/${key}`
        : `https://${this.bucket}.s3.amazonaws.com/${key}`
    };
  }

  async uploadImage(file: any, folder = "products") {
    if (!this.bucket) {
      throw new InternalServerErrorException(
        "S3 chưa được cấu hình. Hãy bổ sung AWS_S3_BUCKET trong .env."
      );
    }

    if (!file) {
      throw new BadRequestException("Không nhận được file upload.");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("Chỉ hỗ trợ upload hình ảnh.");
    }

    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const key = `${folder}/${randomUUID()}-${safeFilename}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
      })
    );

    return {
      key,
      fileUrl: this.publicBaseUrl
        ? `${this.publicBaseUrl.replace(/\/$/, "")}/${key}`
        : `https://${this.bucket}.s3.amazonaws.com/${key}`
    };
  }
}
