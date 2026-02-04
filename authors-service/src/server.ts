import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";
import { createApp } from "./app";

async function main() {
  await AppDataSource.initialize();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[authors-service] listening on port ${env.port}`);
  });
}

main().catch((err) => {
  console.error("[authors-service] failed to start", err);
  process.exit(1);
});
