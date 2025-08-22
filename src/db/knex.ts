import knex from "knex";
import { env } from "../config/env";


const db = knex({
  client: "pg",
  connection: `postgres://${env.DB.USER}:${env.DB.PASSWORD}@${env.DB.HOST}:${env.DB.PORT}/${env.DB.NAME}`,
});