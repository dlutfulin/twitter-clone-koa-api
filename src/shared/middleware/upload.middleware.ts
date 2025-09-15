// src/shared/middleware/upload.middleware.ts
import multer from "multer";
import { Context, Next } from "koa";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Разрешенные типы файлов
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png", 
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export const uploadMiddleware = (fieldName: string = "file") => {
  return async (ctx: Context, next: Next) => {
    return new Promise((resolve, reject) => {
      const multerMiddleware = upload.single(fieldName);
      
      multerMiddleware(ctx.req as any, ctx.res as any, (err: any) => {
        if (err) {
          ctx.status = 400;
          ctx.body = {
            error: err.message || "File upload failed",
          };
          reject(err);
        } else {
          ctx.request.file = (ctx.req as any).file;
          resolve(next());
        }
      });
    });
  };
};

export const requireFileMiddleware = async (ctx: Context, next: Next) => {
  if (!ctx.request.file) {
    ctx.status = 400;
    ctx.body = {
      error: "File is required",
    };
    return;
  }
  await next();
};

declare module "koa" {
  interface Request {
    file?: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      buffer: Buffer;
      size: number;
    };
  }
}