"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateLocalizedColumns = migrateLocalizedColumns;
const sequelize_1 = require("../config/sequelize");
const WRAP_STATEMENTS = [
    `UPDATE products SET name = JSON_OBJECT('hy', CAST(name AS CHAR), 'en', CAST(name AS CHAR)) WHERE name IS NOT NULL AND JSON_TYPE(name) IS NULL`,
    `UPDATE products SET description = JSON_OBJECT('hy', CAST(description AS CHAR), 'en', CAST(description AS CHAR)) WHERE description IS NOT NULL AND JSON_TYPE(description) IS NULL`,
    `UPDATE products SET badge = JSON_OBJECT('hy', CAST(badge AS CHAR), 'en', CAST(badge AS CHAR)) WHERE badge IS NOT NULL AND JSON_TYPE(badge) IS NULL`,
    `UPDATE faqs SET question = JSON_OBJECT('hy', CAST(question AS CHAR), 'en', CAST(question AS CHAR)) WHERE question IS NOT NULL AND JSON_TYPE(question) IS NULL`,
    `UPDATE faqs SET answer = JSON_OBJECT('hy', CAST(answer AS CHAR), 'en', CAST(answer AS CHAR)) WHERE answer IS NOT NULL AND JSON_TYPE(answer) IS NULL`,
    `UPDATE gallery SET alt = JSON_OBJECT('hy', CAST(alt AS CHAR), 'en', CAST(alt AS CHAR)) WHERE alt IS NOT NULL AND JSON_TYPE(alt) IS NULL`,
    `UPDATE reviews SET product = JSON_OBJECT('hy', CAST(product AS CHAR), 'en', CAST(product AS CHAR)) WHERE product IS NOT NULL AND JSON_TYPE(product) IS NULL`,
    `UPDATE reviews SET comment = JSON_OBJECT('hy', CAST(comment AS CHAR), 'en', CAST(comment AS CHAR)) WHERE comment IS NOT NULL AND JSON_TYPE(comment) IS NULL`,
];
const ALTER_STATEMENTS = [
    `ALTER TABLE products MODIFY name JSON NOT NULL`,
    `ALTER TABLE products MODIFY description JSON NULL`,
    `ALTER TABLE products MODIFY badge JSON NULL`,
    `ALTER TABLE faqs MODIFY question JSON NOT NULL`,
    `ALTER TABLE faqs MODIFY answer JSON NOT NULL`,
    `ALTER TABLE gallery MODIFY alt JSON NOT NULL`,
    `ALTER TABLE reviews MODIFY product JSON NOT NULL`,
    `ALTER TABLE reviews MODIFY comment JSON NOT NULL`,
];
/** Convert legacy single-string columns to { hy, en } JSON. */
async function migrateLocalizedColumns() {
    for (const sql of WRAP_STATEMENTS) {
        try {
            await sequelize_1.sequelize.query(sql);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (!/JSON_TYPE|Unknown column|doesn't exist/i.test(message)) {
                console.warn(`migrateLocalizedColumns wrap skipped: ${message}`);
            }
        }
    }
    for (const sql of ALTER_STATEMENTS) {
        try {
            await sequelize_1.sequelize.query(sql);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (!/duplicate|already|JSON|incompatible/i.test(message)) {
                console.warn(`migrateLocalizedColumns alter skipped: ${message}`);
            }
        }
    }
}
