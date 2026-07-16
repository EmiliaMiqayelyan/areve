import { Product } from "../models";
import { isDataUrlImage, persistDataUrlImage } from "./persistUpload";

/**
 * Move existing product data-URL images to /uploads/products so list APIs stay small.
 * Runs once on startup; safe to re-run (skips non-data-URL images).
 */
export async function migrateProductImages() {
  const rows = await Product.findAll({ attributes: ["id", "image"] });
  let migrated = 0;

  for (const row of rows) {
    const id = String(row.get("id"));
    const image = String(row.get("image") ?? "");
    if (!isDataUrlImage(image)) continue;

    try {
      const stored = await persistDataUrlImage(image, "products", id);
      await Product.update({ image: stored }, { where: { id } });
      migrated += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`migrateProductImages: skipped ${id} (${message})`);
    }
  }

  if (migrated > 0) {
    console.log(`migrateProductImages: moved ${migrated} product image(s) to /uploads`);
  }
}
