import mysql from "mysql2/promise";
export async function createPoolFromEnv() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "gosyandu",
    waitForConnections: true,
    connectionLimit: 10
  });
  await pool.query("SELECT 1");
  return pool;
}
