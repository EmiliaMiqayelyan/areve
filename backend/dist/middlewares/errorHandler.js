"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
function errorHandler(err, _req, res, next) {
    if (res.headersSent)
        return next(err);
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
    if (err instanceof sequelize_1.ValidationError) {
        return res.status(400).json({
            message: err.message,
            errors: err.errors.map((e) => ({ path: e.path ?? "", message: e.message })),
        });
    }
    if (err instanceof sequelize_1.UniqueConstraintError) {
        return res.status(409).json({ message: "Resource already exists" });
    }
    if (err instanceof sequelize_1.ForeignKeyConstraintError) {
        return res.status(400).json({ message: "Related record not found" });
    }
    console.error("[API Error]", err);
    return res.status(500).json({ message: "Internal server error" });
}
