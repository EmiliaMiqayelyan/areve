import { sequelize } from "../config/sequelize";

const STATEMENTS = [
  `ALTER TABLE products MODIFY image MEDIUMTEXT NOT NULL`,
  `ALTER TABLE gallery MODIFY src MEDIUMTEXT NOT NULL`,
  `ALTER TABLE settings ADD COLUMN telegram_url VARCHAR(255) NOT NULL DEFAULT ''`,
  `ALTER TABLE settings ADD COLUMN tiktok_url VARCHAR(255) NOT NULL DEFAULT ''`,
  `ALTER TABLE settings ADD COLUMN youtube_url VARCHAR(255) NOT NULL DEFAULT ''`,
  `ALTER TABLE settings ADD COLUMN site_content JSON NULL`,
  `ALTER TABLE products ADD COLUMN cost DECIMAL(10,2) NOT NULL DEFAULT 0`,
  `ALTER TABLE order_items ADD COLUMN unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0`,
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
