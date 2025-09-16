import { Context } from "koa";
import { inject, injectable } from "tsyringe";
import { S3Service } from "../../../services/aws/s3.service";
import { UserService } from "../../../services/user/user.service";

@injectable()
export class UploadController {
  constructor(
    @inject(S3Service) private s3Service: S3Service,
    @inject(UserService) private userService: UserService
  ) {}

  async uploadAvatar(ctx: Context) {
    try {
      console.log(
        "S3_BUCKET:",
        process.env.AWS_S3_BUCKET ? process.env.AWS_S3_BUCKET : "undefined"
      );
      const userId = ctx.state.user.id;
      const file = ctx.request.file;

      

      if (!file) {
        ctx.status = 400;
        ctx.body = { error: "No file provided" };
        return;
      }
            console.log("UserId:", userId);
console.log("File:", file.originalname, file.mimetype, file.size);
      this.s3Service.validateImageFile(file.mimetype, file.size);
            console.log("UserId:", userId);
console.log("File:", file.originalname, file.mimetype, file.size);
      const uploadResult = await this.s3Service.uploadAvatar(
        file.buffer,
        file.originalname,
        file.mimetype,
        userId
      );

            console.log("UserId:", userId);
console.log("File:", file.originalname, file.mimetype, file.size);

      await this.userService.updateUserAvatar(
        userId,
        uploadResult.url,
        uploadResult.key
      );
                  console.log("UserId:", userId);
console.log("File:", file.originalname, file.mimetype, file.size);

      ctx.status = 200;
      ctx.body = {
        message: "Avatar uploaded successfully",
        avatar_url: uploadResult.url,
      };
    } catch (error: any) {

      ctx.status = 400;
      ctx.body = {
        
        error: error.message || "Failed to upload avatar",
      };
    }
  }

  async uploadPostMedia(ctx: Context) {
    try {
      const file = ctx.request.file;

      if (!file) {
        ctx.status = 400;
        ctx.body = { error: "No file provided" };
        return;
      }

      const userId = ctx.state.user.id;

      if (file.mimetype.startsWith("image/")) {
        this.s3Service.validateImageFile(file.mimetype, file.size);
      } else {
        throw new Error("Only images and videos are allowed");
      }

      const uploadResult = await this.s3Service.uploadPostMedia(
        file.buffer,
        file.originalname,
        file.mimetype,
        userId
      );

      ctx.status = 200;
      ctx.body = {
        message: "Media uploaded successfully",
        mediaUrl: uploadResult.url,
        s3Key: uploadResult.key,
      };
    } catch (error: any) {
      ctx.status = 400;
      ctx.body = {
        error: error.message || "Failed to upload media",
      };
    }
  }
}
