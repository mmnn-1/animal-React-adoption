import mysql from "mysql2";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const saltRounds = 10;

// 撈出所有使用者
db.query("SELECT id, password FROM users", async (err, users) => {
  if (err) {
    console.error("查詢失敗", err);
    process.exit();
  }

  for (const user of users) {
    // ⚠️ 如果已經是 bcrypt hash，就跳過
    if (user.password.startsWith("$2")) {
      console.log(`user ${user.id} 已是 hash，略過`);
      continue;
    }

    // 將舊明碼轉成 hash
    const hashed = await bcrypt.hash(user.password, saltRounds);

    // 更新回資料庫
    await new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashed, user.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    console.log(`user ${user.id} 密碼已轉換`);
  }

  console.log("✅ 所有舊密碼轉換完成");
  db.end();
});
