import knex from "knex";
import config from "../../knexfile"; 
import { env } from "../config/env";

const environment = env.NODE_ENV || "development";

export const db = knex(config[environment]);