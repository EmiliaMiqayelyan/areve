"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const promise_1 = __importDefault(require("mysql2/promise"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = require("crypto");
const env_1 = require("../config/env");
async function run() {
    const connection = await promise_1.default.createConnection({
        host: env_1.env.dbHost,
        port: env_1.env.dbPort,
        user: env_1.env.dbUser,
        password: env_1.env.dbPassword,
        multipleStatements: true,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${env_1.env.dbName}\``);
    await connection.query(`USE \`${env_1.env.dbName}\``);
    const schemaPath = path_1.default.join(__dirname, "..", "sql", "schema.sql");
    const sql = fs_1.default.readFileSync(schemaPath, "utf8");
    await connection.query(sql);
    const hash = await bcryptjs_1.default.hash(env_1.env.adminPassword, 10);
    await connection.query(`INSERT INTO admins (id, name, email, password_hash, role)
     VALUES (?, 'Admin User', ?, ?, 'super_admin')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`, [(0, crypto_1.randomUUID)(), env_1.env.adminEmail, hash]);
    await connection.end();
    console.log(`Database initialized: ${env_1.env.dbName}`);
}
run().catch((error) => {
    console.error(error);
    process.exit(1);
});
