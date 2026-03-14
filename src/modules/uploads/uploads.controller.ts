import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateUploadUrlDto } from "./dto/create-upload-url.dto";
import { UploadsService } from "./uploads.service";

@Controller("uploads")
export class UploadsController {
  constructor(
    @Inject(UploadsService) private readonly uploadsService: UploadsService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("presign")
  createPresignedUrl(@Body() body: CreateUploadUrlDto) {
    return this.uploadsService.createPresignedUpload(body);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Post("image")
  uploadImage(
    @UploadedFile() file: any,
    @Body("folder") folder?: string
  ) {
    return this.uploadsService.uploadImage(file, folder);
  }
}
