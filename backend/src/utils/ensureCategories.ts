import { Category } from "../models";
import { sequelize } from "../config/sequelize";

const DEFAULT_CATEGORIES = [
  { id: "bags", name: { hy: "Բիջակապարց տոպրակներ", en: "Beaded Bags" }, sortOrder: 1 },
  { id: "toys", name: { hy: "Ձեռագործ խաղալիքներ", en: "Handmade Toys" }, sortOrder: 2 },
  { id: "accessories", name: { hy: "Աքսեսուարներ", en: "Accessories" }, sortOrder: 3 },
] as const;

/** Create categories table, widen product.category, seed defaults. */
export async function ensureCategories() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(64) PRIMARY KEY,
      name JSON NOT NULL,
      sort_order INT NOT NULL DEFAULT 0
    )
  `);

  try {
    await sequelize.query(`ALTER TABLE products MODIFY category VARCHAR(64) NOT NULL`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/Unknown column|doesn't exist/i.test(message)) {
      console.warn(`ensureCategories: product column migration skipped (${message})`);
    }
  }

  const count = await Category.count();
  if (count === 0) {
    await Category.bulkCreate([...DEFAULT_CATEGORIES]);
    console.log("ensureCategories: seeded default categories");
  }
}
