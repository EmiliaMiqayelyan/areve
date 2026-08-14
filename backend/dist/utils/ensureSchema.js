"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSchemaColumns = ensureSchemaColumns;
const sequelize_1 = require("../config/sequelize");
const STATEMENTS = [
    `ALTER TABLE products MODIFY image MEDIUMTEXT NOT NULL`,
    `ALTER TABLE gallery MODIFY src MEDIUMTEXT NOT NULL`,
    `ALTER TABLE gallery ADD COLUMN sort_order INT NOT NULL DEFAULT 0`,
    `ALTER TABLE settings ADD COLUMN telegram_url VARCHAR(255) NOT NULL DEFAULT ''`,
    `ALTER TABLE settings ADD COLUMN tiktok_url VARCHAR(255) NOT NULL DEFAULT ''`,
    `ALTER TABLE settings ADD COLUMN youtube_url VARCHAR(255) NOT NULL DEFAULT ''`,
    `ALTER TABLE settings ADD COLUMN site_content JSON NULL`,
    `ALTER TABLE products ADD COLUMN cost DECIMAL(10,2) NOT NULL DEFAULT 0`,
    `ALTER TABLE products ADD COLUMN is_favorite TINYINT(1) NOT NULL DEFAULT 0`,
    `ALTER TABLE products ADD COLUMN sort_order INT NOT NULL DEFAULT 0`,
    `ALTER TABLE order_items ADD COLUMN unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0`,
];
/** Idempotent schema adjustments for dev DBs created before newer columns. */
async function ensureSchemaColumns() {
    for (const sql of STATEMENTS) {
        try {
            await sequelize_1.sequelize.query(sql);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (!/Duplicate column|check that column/i.test(message)) {
                console.warn(`ensureSchemaColumns: skipped (${message})`);
            }
        }
    }
    // Backfill gallery sort_order from created_at when all values are still 0.
    try {
        const [rows] = await sequelize_1.sequelize.query(`SELECT COUNT(*) AS total,
              SUM(CASE WHEN sort_order = 0 THEN 1 ELSE 0 END) AS zeros
       FROM gallery`);
        const stats = rows[0];
        const total = Number(stats?.total ?? 0);
        const zeros = Number(stats?.zeros ?? 0);
        if (total > 1 && zeros === total) {
            await sequelize_1.sequelize.query(`SET @gallery_rn := -1`);
            await sequelize_1.sequelize.query(`UPDATE gallery
         SET sort_order = (@gallery_rn := @gallery_rn + 1)
         ORDER BY created_at DESC`);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`ensureSchemaColumns: gallery sort backfill skipped (${message})`);
    }
    // Backfill product sort_order from created_at when all values are still 0.
    try {
        const [rows] = await sequelize_1.sequelize.query(`SELECT COUNT(*) AS total,
              SUM(CASE WHEN sort_order = 0 THEN 1 ELSE 0 END) AS zeros
       FROM products`);
        const stats = rows[0];
        const total = Number(stats?.total ?? 0);
        const zeros = Number(stats?.zeros ?? 0);
        if (total > 1 && zeros === total) {
            await sequelize_1.sequelize.query(`SET @product_rn := -1`);
            await sequelize_1.sequelize.query(`UPDATE products
         SET sort_order = (@product_rn := @product_rn + 1)
         ORDER BY created_at DESC`);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`ensureSchemaColumns: product sort backfill skipped (${message})`);
    }
    const indexStatements = [
        `CREATE INDEX idx_products_status_sort ON products (status, sort_order, created_at)`,
        `CREATE INDEX idx_products_favorite ON products (status, is_favorite, sort_order)`,
        `CREATE INDEX idx_products_category ON products (status, category, sort_order)`,
    ];
    for (const sql of indexStatements) {
        try {
            await sequelize_1.sequelize.query(sql);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (!/Duplicate key name|already exists/i.test(message)) {
                console.warn(`ensureSchemaColumns: index skipped (${message})`);
            }
        }
    }
}
