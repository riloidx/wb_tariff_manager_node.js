import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const dbUser = process.env.POSTGRES_USER ?? "postgres";
const dbPassword = process.env.POSTGRES_PASSWORD ?? "postgres";
const dbHost = process.env.POSTGRES_HOST ?? "db";
const dbPort = process.env.POSTGRES_PORT ?? "5432";
const dbName = process.env.POSTGRES_DB ?? "postgres";

const database_url =
  process.env.DATABASE_URL ??
  `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: database_url,
    migrations: {
      directory: "./src/db/migrations",
      tableName: "knex_migrations",
    },
  },
};

export default config;
