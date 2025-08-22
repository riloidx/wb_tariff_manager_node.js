import assert from "assert";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  assert(value !== undefined, `Missing env variable: ${key}`);
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT) || 3000,

  DB: {
    USER: getEnvVar("POSTGRES_USER", "postgres"),
    PASSWORD: getEnvVar("POSTGRES_PASSWORD", "postgres"),
    NAME: getEnvVar("POSTGRES_DB", "postgres"),
    HOST: getEnvVar("POSTGRES_HOST", "db"),
    PORT: Number(getEnvVar("POSTGRES_PORT", "5432")),
  },

  WB_API_TOKEN: getEnvVar("WB_API_TOKEN"),

  GOOGLE: {
    SERVICE_ACCOUNT_EMAIL: getEnvVar("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    PRIVATE_KEY: getEnvVar("GOOGLE_PRIVATE_KEY"),
  },
};