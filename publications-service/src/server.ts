import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";
import { createApp } from "./app";

async function main() {
  await AppDataSource.initialize();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[publications-service] listening on port ${env.port}`);
    console.log(`[publications-service] Authors base URL: ${env.authors.baseUrl}`);
  });
}

main().catch((err) => {
  console.error("[publications-service] failed to start", err);
  process.exit(1);
});
