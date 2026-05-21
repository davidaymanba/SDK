import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const DEFAULT_DATABASE = "dk_motorsport";
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 3306;

function resolveDatabaseConfig() {
  const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

  if (connectionUrl) {
    const url = new URL(connectionUrl);

    return {
      database: decodeURIComponent(url.pathname.replace(/^\/+/, "")) || process.env.DB_NAME || DEFAULT_DATABASE,
      user: decodeURIComponent(url.username || "root"),
      password: decodeURIComponent(url.password || ""),
      host: url.hostname,
      port: Number(url.port || DEFAULT_PORT),
    };
  }

  return {
    database: process.env.DB_NAME || DEFAULT_DATABASE,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || DEFAULT_HOST,
    port: Number(process.env.DB_PORT || DEFAULT_PORT),
  };
}

const databaseConfig = resolveDatabaseConfig();

export const sequelize = new Sequelize(databaseConfig.database, databaseConfig.user, databaseConfig.password, {
  host: databaseConfig.host,
  port: databaseConfig.port,
  dialect: "mysql",
  dialectOptions: { charset: "utf8mb4" },
  logging: false,
  define: {
    underscored: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
});

export async function connectDatabase() {
  const bootstrap = await mysql.createConnection({
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.user,
    password: databaseConfig.password,
  });
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${databaseConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await bootstrap.end();
  await sequelize.authenticate();
  console.log("Database connection established");
}
