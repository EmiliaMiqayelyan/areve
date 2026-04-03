import app from "./app";
import { env } from "./config/env";
import { sequelize } from "./config/sequelize";
import "./models";

async function ensureImageColumns() {
  // Some dev databases may have the old VARCHAR(500) schema.
  // If we don't widen it, uploaded data URLs get truncated and will not render.
  try {
    await sequelize.query(`ALTER TABLE products MODIFY image MEDIUMTEXT NOT NULL;`);
  } catch (e) {
    console.warn("ensureImageColumns: products.image alter failed (may be already correct).", e);
  }

  try {
    await sequelize.query(`ALTER TABLE gallery MODIFY src MEDIUMTEXT NOT NULL;`);
  } catch (e) {
    console.warn("ensureImageColumns: gallery.src alter failed (may be already correct).", e);
  }
}

async function bootstrap() {
  await sequelize.authenticate();
  await ensureImageColumns();
  app.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
