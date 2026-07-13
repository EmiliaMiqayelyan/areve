import { sequelize } from "../config/sequelize";

const STATEMENTS = [
  `ALTER TABLE products MODIFY image MEDIUMTEXT NOT NULL`,
  `ALTER TABLE gallery MODIFY src MEDIUMTEXT NOT NULL`,
  `ALTER TABLE gallery ADD COLUMN sort_order INT NOT NULL DEFAULT 0`,
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

  // Backfill gallery sort_order from created_at when all values are still 0.
  try {
    const [rows] = await sequelize.query(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN sort_order = 0 THEN 1 ELSE 0 END) AS zeros
       FROM gallery`
    );
    const stats = (rows as Array<{ total: number; zeros: number }>)[0];
    const total = Number(stats?.total ?? 0);
    const zeros = Number(stats?.zeros ?? 0);
    if (total > 1 && zeros === total) {
      await sequelize.query(`SET @gallery_rn := -1`);
      await sequelize.query(
        `UPDATE gallery
         SET sort_order = (@gallery_rn := @gallery_rn + 1)
         ORDER BY created_at DESC`
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`ensureSchemaColumns: gallery sort backfill skipped (${message})`);
  }
}
