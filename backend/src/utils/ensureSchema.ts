import { sequelize } from "../config/sequelize";

const STATEMENTS = [
  `ALTER TABLE products MODIFY image MEDIUMTEXT NOT NULL`,
  `ALTER TABLE gallery MODIFY src MEDIUMTEXT NOT NULL`,
  `ALTER TABLE settings ADD COLUMN tiktok_url VARCHAR(255) NOT NULL DEFAULT ''`,
  `ALTER TABLE settings ADD COLUMN youtube_url VARCHAR(255) NOT NULL DEFAULT ''`,
  `ALTER TABLE settings ADD COLUMN site_content JSON NULL`,
];

/** Idempotent schema adjustments for dev DBs created before newer columns. */
export async function ensureSchemaColumns() {
  for (const sql of STATEMENTS) {
    try {
      await sequelize.query(sql);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/Duplicate column|check that column/i.test(message)) {
        console.warn(`ensureSchemaColumns: skipped (${message})`);
      }
    }
  }
}
