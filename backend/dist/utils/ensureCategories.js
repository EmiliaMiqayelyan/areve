"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureCategories = ensureCategories;
const models_1 = require("../models");
const sequelize_1 = require("../config/sequelize");
const DEFAULT_CATEGORIES = [
    { id: "bags", name: { hy: "Բիջակապարց տոպրակներ", en: "Beaded Bags" }, sortOrder: 1 },
    { id: "toys", name: { hy: "Ձեռագործ խաղալիքներ", en: "Handmade Toys" }, sortOrder: 2 },
    { id: "accessories", name: { hy: "Աքսեսուարներ", en: "Accessories" }, sortOrder: 3 },
];
/** Create categories table, widen product.category, seed defaults. */
async function ensureCategories() {
    await sequelize_1.sequelize.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(64) PRIMARY KEY,
      name JSON NOT NULL,
      sort_order INT NOT NULL DEFAULT 0
    )
  `);
    try {
        await sequelize_1.sequelize.query(`ALTER TABLE products MODIFY category VARCHAR(64) NOT NULL`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!/Unknown column|doesn't exist/i.test(message)) {
            console.warn(`ensureCategories: product column migration skipped (${message})`);
        }
    }
    const count = await models_1.Category.count();
    if (count === 0) {
        await models_1.Category.bulkCreate([...DEFAULT_CATEGORIES]);
        console.log("ensureCategories: seeded default categories");
    }
}
