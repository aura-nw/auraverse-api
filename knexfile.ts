"use strict";

import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const migrations = {
  directory: path.join(__dirname, "migrations"),
};

const seeds = {
  directory: path.join(__dirname, "seeds"),
};

const baseConfig = {
  client: "mysql2",
  version: "8.0",
  migrations,
  seeds,
};

const connection = {
  host: process.env.DB_GENERIC_HOST,
  user: process.env.DB_GENERIC_USER,
  password: process.env.DB_GENERIC_PASSWORD,
  database: process.env.DB_GENERIC_DBNAME,
  port: process.env.DB_GENERIC_PORT,
};


module.exports = {
  development: {
    ...baseConfig,
    connection,
    pool: {
      min: 1,
      max: 3,
    },
  },
  test: {
    ...baseConfig,
    connection: {
      ...connection,
      database: process.env.DB_GENERIC_DBNAME,
    },
  },
  staging: {
    ...baseConfig,
    connection: {
      host: process.env.DB_GENERIC_HOST,
      user: process.env.DB_GENERIC_USER,
      password: process.env.DB_GENERIC_PASSWORD,
      database: process.env.DB_GENERIC_DBNAME,
      port: process.env.DB_GENERIC_PORT,
    },
  },
  production: {
    ...baseConfig,
    connection: {
      host: process.env.DB_GENERIC_HOST,
      user: process.env.DB_GENERIC_USER,
      password: process.env.DB_GENERIC_PASSWORD,
      database: process.env.DB_GENERIC_DBNAME,
      port: process.env.DB_GENERIC_PORT,
    },
    pool: {
      min: 1,
      max: 3,
    },
  },
};
