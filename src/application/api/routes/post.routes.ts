import Router from "@koa/router";
import { container } from "../../../shared/container";
import { PostController } from "../controllers/post.controller";
import {
  authMiddleware,
  activeUserMiddleware,
} from "../../../shared/middleware/auth.middleware";

const router = new Router({ prefix: "/api/v1/posts" });
const postController = container.resolve(PostController);

// Public routes

// Protected routes
router.use(authMiddleware);
router.use(activeUserMiddleware);

router.post("/", (ctx) => postController.createPost(ctx));

export default router;