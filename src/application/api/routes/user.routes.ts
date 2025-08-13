import Router from "@koa/router";
import { container } from "../../../shared/infrastructure/container";
import { UserController } from "../controllers/user.controller";
import {
  activeUserMiddleware,
  authMiddleware,
} from "../../../shared/infrastructure/middleware/auth.middleware";

const router = new Router({ prefix: "/api/v1/users" });

const userController = container.resolve(UserController);

router.post("/register", (ctx) => userController.register(ctx));
router.post("/login", (ctx) => userController.login(ctx));

router.use(authMiddleware);
router.use(activeUserMiddleware);

router.get("/", (ctx) => userController.getAllUsers(ctx))
router.get("/:id", (ctx) => userController.getUser(ctx))

export default router;
