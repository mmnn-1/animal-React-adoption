import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
export const db = mysql.createConnection({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT), 
});

db.connect(err => {
  if (err) console.error('資料庫連線失敗：', err);
  else console.log('已連線到資料庫');
});
