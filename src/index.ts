import "reflect-metadata";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { getDb } from "./shared/infrastructure/drizzle-orm";
import "./shared/infrastructure/container";
import userRoutes from "./application/api/routes/user.routes";
import dotenv from "dotenv";

async function bootstrap() {
  await getDb();

  const app = new Koa();

  app
    .use(bodyParser())
    .use(userRoutes.routes())
    .use(userRoutes.allowedMethods());

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

dotenv.config();
bootstrap();
