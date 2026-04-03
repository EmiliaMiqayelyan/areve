import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import publicRoutes from "./routes/public.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin === "*" ? "*" : env.corsOrigin.split(","), credentials: true }));
// Admin UI sends image data URLs in JSON. Keep limit high enough
// so uploads don't fail/truncate.
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.use("/api", publicRoutes);
app.use("/api", authRoutes);
app.use("/api", adminRoutes);

app.use(errorHandler);

export default app;
