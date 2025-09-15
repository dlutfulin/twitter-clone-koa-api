import Router from "@koa/router";
import { container } from "../../../shared/container";
import { UploadController } from "../controllers/upload.controller";
import { authMiddleware, activeUserMiddleware } from "../../../shared/middleware/auth.middleware";
import { uploadMiddleware, requireFileMiddleware } from "../../../shared/middleware/upload.middleware";

const router = new Router({ prefix: "/api/v1/upload" });
const uploadController = container.resolve(UploadController);

router.use(authMiddleware);
router.use(activeUserMiddleware);

router.post(
  "/avatar",
  uploadMiddleware("avatar"),
  requireFileMiddleware,
  (ctx) => uploadController.uploadAvatar(ctx)
);

router.post(
  "/media",
  uploadMiddleware("media"),
  requireFileMiddleware,
  (ctx) => uploadController.uploadPostMedia(ctx)
);

export default router;