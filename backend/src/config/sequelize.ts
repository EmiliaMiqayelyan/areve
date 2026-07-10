import { Sequelize } from "sequelize";
import { env } from "./env";

export const sequelize = new Sequelize(env.dbName, env.dbUser, env.dbPassword, {
  host: env.dbHost,
  port: env.dbPort,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 10_000,
    idle: 10_000,
  },
  dialectOptions: {
    charset: "utf8mb4",
    connectTimeout: 10_000,
  },
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
});
