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
    // Ensure image columns are large enough for admin uploads (data URLs).
    // Existing installs may already have VARCHAR(500) columns; without this, uploads get truncated.
    await connection.query(`
    ALTER TABLE products MODIFY image MEDIUMTEXT NOT NULL;
  `);
    await connection.query(`
    ALTER TABLE gallery MODIFY src MEDIUMTEXT NOT NULL;
  `);
    const migrations = [
        `ALTER TABLE settings ADD COLUMN tiktok_url VARCHAR(255) NOT NULL DEFAULT ''`,
        `ALTER TABLE settings ADD COLUMN youtube_url VARCHAR(255) NOT NULL DEFAULT ''`,
        `ALTER TABLE settings ADD COLUMN site_content JSON NULL`,
        `ALTER TABLE order_items ADD COLUMN stone_type VARCHAR(120) NOT NULL DEFAULT ''`,
        `ALTER TABLE order_items ADD COLUMN stone_mm VARCHAR(40) NOT NULL DEFAULT ''`,
        `ALTER TABLE order_items ADD COLUMN bag_size VARCHAR(80) NOT NULL DEFAULT ''`,
        `ALTER TABLE order_items ADD COLUMN stone_price DECIMAL(10,2) NOT NULL DEFAULT 0`,
        `ALTER TABLE order_items ADD COLUMN bag_price DECIMAL(10,2) NOT NULL DEFAULT 0`,
    ];
    for (const sql of migrations) {
        try {
            await connection.query(sql);
        }
        catch {
            // Column may already exist on re-run.
        }
    }
    const hash = await bcryptjs_1.default.hash(env_1.env.adminPassword, 10);
    const [existingRows] = await connection.query(`SELECT id FROM admins WHERE email = ? LIMIT 1`, [env_1.env.adminEmail]);
    const existing = existingRows;
    if (existing.length > 0) {
        await connection.query(`UPDATE admins SET password_hash = ? WHERE email = ?`, [hash, env_1.env.adminEmail]);
    }
    else {
        await connection.query(`INSERT INTO admins (id, name, email, password_hash, role) VALUES (?, 'Admin User', ?, ?, 'super_admin')`, [(0, crypto_1.randomUUID)(), env_1.env.adminEmail, hash]);
    }
    await connection.end();
    console.log(`Database initialized: ${env_1.env.dbName}`);
}
run().catch((error) => {
    console.error(error);
    process.exit(1);
});
