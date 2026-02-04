import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors";
import { authorsRouter } from "./controllers/authors.routes";
import { healthRouter } from "./controllers/health.routes";
import { errorHandler } from "./shared/middleware/errorHandler";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/health", healthRouter);
  app.use("/authors", authorsRouter);

  app.use(errorHandler);
  return app;
}
