import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { env } from "../config/env";

async function run() {
  const connection = await mysql.createConnection({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    multipleStatements: true,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${env.dbName}\``);
  await connection.query(`USE \`${env.dbName}\``);
  const schemaPath = path.join(__dirname, "..", "sql", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
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
    } catch {
      // Column may already exist on re-run.
    }
  }

  const hash = await bcrypt.hash(env.adminPassword, 10);
  const [existingRows] = await connection.query(
    `SELECT id FROM admins WHERE email = ? LIMIT 1`,
    [env.adminEmail]
  );
  const existing = existingRows as Array<{ id: string }>;
  if (existing.length > 0) {
    await connection.query(`UPDATE admins SET password_hash = ? WHERE email = ?`, [hash, env.adminEmail]);
  } else {
    await connection.query(
      `INSERT INTO admins (id, name, email, password_hash, role) VALUES (?, 'Admin User', ?, ?, 'super_admin')`,
      [randomUUID(), env.adminEmail, hash]
    );
  }

  await connection.end();
  console.log(`Database initialized: ${env.dbName}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
