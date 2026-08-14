"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middlewares/errorHandler");
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const public_routes_1 = __importDefault(require("./routes/public.routes"));
const persistUpload_1 = require("./utils/persistUpload");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
/** Reflect request Origin when CORS_ORIGIN=* so credentials work in browsers. */
const corsOrigins = env_1.env.corsOrigin.trim() === "*"
    ? true
    : env_1.env.corsOrigin
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
app.use((0, cors_1.default)({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Admin UI may still send compact data URLs; large images are written to disk.
app.use(express_1.default.json({ limit: "25mb" }));
if (process.env.NODE_ENV !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
app.use("/uploads", express_1.default.static(persistUpload_1.UPLOAD_ROOT));
app.use("/api", public_routes_1.default);
app.use("/api", auth_routes_1.default);
app.use("/api", admin_routes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
