import Router from "@koa/router";
import { container } from "../../../shared/container";
import {
  authMiddleware,
  activeUserMiddleware,
} from "../../../shared/middleware/auth.middleware";
import { LikeController } from "../controllers/like.controller";

const router = new Router({ prefix: "/api/v1/like" });
const likeController = container.resolve(LikeController);

router.use(authMiddleware);
router.use(activeUserMiddleware);

router.post("/:postId", (ctx) => likeController.likePost(ctx));
router.delete("/:postId", (ctx) => likeController.unlikePost(ctx));
router.get("/:postId/is-liked", (ctx) => likeController.isLiked(ctx));
router.get("/:postId/count", (ctx) => likeController.getLikesCount(ctx));

export default router;
