import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import publicRoutes from "./routes/public.routes";
import { UPLOAD_ROOT } from "./utils/persistUpload";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.corsOrigin === "*" ? "*" : env.corsOrigin.split(","), credentials: true }));
// Admin UI may still send compact data URLs; large images are written to disk.
app.use(express.json({ limit: "25mb" }));
app.use(morgan("dev"));

app.use("/uploads", express.static(UPLOAD_ROOT));

app.use("/api", publicRoutes);
app.use("/api", authRoutes);
app.use("/api", adminRoutes);

app.use(errorHandler);

export default app;
