"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const env_1 = require("./env");
exports.sequelize = new sequelize_1.Sequelize(env_1.env.dbName, env_1.env.dbUser, env_1.env.dbPassword, {
    host: env_1.env.dbHost,
    port: env_1.env.dbPort,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
        charset: "utf8mb4",
    },
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
    },
});
