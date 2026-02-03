import mysql from 'mysql2';

export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mm8780461',
  database: 'qq'
});

db.connect(err => {
  if (err) console.error('資料庫連線失敗：', err);
  else console.log('已連線到資料庫');
});
