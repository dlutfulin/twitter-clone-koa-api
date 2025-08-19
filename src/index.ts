import "reflect-metadata";
import dotenv from "dotenv";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import "./shared/container";
import authRoutes from "./application/api/routes/auth.routes";
import userRoutes from "./application/api/routes/user.routes";
import postRoutes from "./application/api/routes/post.routes";
import { getDb } from "./shared/drizzle-orm";

async function bootstrap() {
  dotenv.config();

  await getDb();

  const app = new Koa();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    })
  );

  app.use(
    bodyParser({
      jsonLimit: "10mb",
      enableTypes: ["json", "form", "text"],
    })
  );

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err: any) {
      console.error("Unhandled error:", err);
      ctx.status = err.status || 500;
      ctx.body = {
        error: ctx.status === 500 ? "Internal server error" : err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      };
    }
  });

  app.use(authRoutes.routes());
  app.use(authRoutes.allowedMethods());
  app.use(userRoutes.routes());
  app.use(userRoutes.allowedMethods());
  app.use(postRoutes.routes());
  app.use(postRoutes.allowedMethods());

  app.use(async (ctx, next) => {
    if (ctx.path === "/health") {
      ctx.status = 200;
      ctx.body = { status: "OK", timestamp: new Date().toISOString() };
      return;
    }
    await next();
  });

  app.use(async (ctx) => {
    ctx.status = 404;
    ctx.body = { error: "Endpoint not found" };
  });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
