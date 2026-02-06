import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),

  ssl: {
    rejectUnauthorized: false
  },

  waitForConnections: true,
  connectionLimit: 5,
  connectTimeout: 10000
});

// 測試連線
(async () => {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('✅ 已連線到 Railway MySQL');
  } catch (err) {
    console.error('❌ 資料庫連線失敗：', err);
  }
})();
