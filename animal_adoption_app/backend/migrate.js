import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();  // 確保載入 .env

// 建立連線池
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT), // port 一定要數字
  multipleStatements: true,           // 允許同時執行多條 SQL
});

async function runSchema() {
  try {
    const sql = fs.readFileSync('./schema.sql', 'utf8');
    await pool.query(sql);
    console.log('✅ Railway MySQL 已建立所有資料表');
  } catch (err) {
    console.error('❌ 執行 schema 失敗：', err);
  } finally {
    await pool.end(); // 結束連線
    process.exit();
  }
}

runSchema();
