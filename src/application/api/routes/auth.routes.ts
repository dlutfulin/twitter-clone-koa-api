import Router from "@koa/router";
import { container } from "../../../shared/container";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware, activeUserMiddleware } from "../../../shared/middleware/auth.middleware";

const router = new Router({ prefix: "/api/v1/auth" });
const authController = container.resolve(AuthController);

// Public routes
router.post("/register", (ctx) => authController.register(ctx));
router.post("/login", (ctx) => authController.login(ctx));
router.post("/refresh", (ctx) => authController.refresh(ctx));

// Protected routes
router.use(authMiddleware);
router.use(activeUserMiddleware);
router.post("/logout", (ctx) => authController.logout(ctx));
router.get("/me", (ctx) => authController.me(ctx));

export default router;