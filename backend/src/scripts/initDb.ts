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

  const hash = await bcrypt.hash(env.adminPassword, 10);
  await connection.query(
    `INSERT INTO admins (id, name, email, password_hash, role)
     VALUES (?, 'Admin User', ?, ?, 'super_admin')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [randomUUID(), env.adminEmail, hash]
  );

  await connection.end();
  console.log(`Database initialized: ${env.dbName}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
