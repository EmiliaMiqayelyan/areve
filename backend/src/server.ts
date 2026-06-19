import app from "./app";
import { env } from "./config/env";
import { sequelize } from "./config/sequelize";
import { ensureSchemaColumns } from "./utils/ensureSchema";
import { migrateLocalizedColumns } from "./utils/migrateLocalizedColumns";
import { repairCorruptedSettings } from "./utils/repairCorruptedSettings";
import { syncDefaultSocialUrls } from "./utils/syncDefaultSocialUrls";
import "./models";

async function bootstrap() {
  await sequelize.authenticate();
  await ensureSchemaColumns();
  await migrateLocalizedColumns();
  await repairCorruptedSettings();
  await syncDefaultSocialUrls();
  app.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
