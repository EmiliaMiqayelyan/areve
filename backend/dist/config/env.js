"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: Number(process.env.PORT || 4000),
    dbHost: process.env.DB_HOST || "localhost",
    dbPort: Number(process.env.DB_PORT || 3306),
    dbUser: process.env.DB_USER || "root",
    dbPassword: process.env.DB_PASSWORD || "",
    dbName: process.env.DB_NAME || "areve_db",
    jwtSecret: process.env.JWT_SECRET || "change-me",
    corsOrigin: process.env.CORS_ORIGIN || "*",
    adminEmail: process.env.ADMIN_EMAIL || "admin@areve.com",
    adminPassword: process.env.ADMIN_PASSWORD || "admin123",
};
