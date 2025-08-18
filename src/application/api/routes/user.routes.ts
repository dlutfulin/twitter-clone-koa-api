import Router from "@koa/router";
import { container } from "../../../shared/container";
import { UserController } from "../controllers/user.controller";
import {
  authMiddleware,
  activeUserMiddleware,
} from "../../../shared/middleware/auth.middleware";

const router = new Router({ prefix: "/api/v1/users" });
const userController = container.resolve(UserController);

router.use(authMiddleware);
router.use(activeUserMiddleware);

router.get("/", (ctx) => userController.getAllUsers(ctx));
router.get("/username/:username", (ctx) =>
  userController.getUserByUsername(ctx)
);
router.get("/:id", (ctx) => userController.getUser(ctx));
router.put("/:id", (ctx) => userController.updateUser(ctx));
router.post("/:id/deactivate", (ctx) => userController.deactivateUser(ctx));
router.post("/:id/activate", (ctx) => userController.activateUser(ctx));

export default router;
