import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db.js';

const router = express.Router();
const saltRounds = 10;

// 註冊
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).send('資料庫錯誤');
    if (results.length > 0) return res.status(400).send('帳號已存在');

    try {
      const hashed = await bcrypt.hash(password, saltRounds);
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], (err) => {
        if (err) return res.status(500).send('註冊失敗');
        res.send('註冊成功');
      });
    } catch (error) {
      res.status(500).send('伺服器錯誤');
    }
  });
});

// 登入
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT id, username, password, role FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).send('資料庫錯誤');
    if (results.length === 0) return res.status(401).send('帳號或密碼錯誤');

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('帳號或密碼錯誤');

    res.json({ msg: "登入成功", userId: user.id, role: user.role });
  });
});

export default router;
