import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.DB_CONNECTION_STRING,
  env: process.env.ENV,
  jwtsecret: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config);
