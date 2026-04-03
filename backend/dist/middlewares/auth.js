"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminAuth = requireAdminAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function requireAdminAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token)
        return res.status(401).json({ message: "Missing admin token" });
    try {
        req.admin = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        return next();
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
