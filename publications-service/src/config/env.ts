import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3002),
  db: {
    host: required("DB_HOST", "localhost"),
    port: Number(process.env.DB_PORT ?? 3306),
    name: required("DB_NAME", "publications_db"),
    user: required("DB_USER", "publications_user"),
    password: required("DB_PASSWORD", "publications_pass"),
  },
  authors: {
    baseUrl: required("AUTHORS_BASE_URL", "http://localhost:3001"),
    timeoutMs: Number(process.env.AUTHORS_HTTP_TIMEOUT_MS ?? 2500),
  },
};
