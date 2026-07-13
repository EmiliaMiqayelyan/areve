import dotenv from "dotenv";
import path from "path";

const candidates = [
  path.resolve(__dirname, "../../.env"), // backend/.env (from src/config or dist/config)
  path.resolve(__dirname, "../../../.env"), // repo root .env
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
];

for (const file of candidates) {
  dotenv.config({ path: file });
}

export const env = {
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
