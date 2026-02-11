import express from 'express';
import multer from 'multer';
import path from 'path';
import { db } from '../db.js';

const router = express.Router();

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'upload/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// 新增動物
router.post('/animals', upload.single('image'), (req, res) => {
  const { type, breed, age, size, gender, monthly_cost, shelter_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `INSERT INTO animals(type, breed, age, size, gender, monthly_cost, image_url, shelter_id, adopted)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`;

  db.query(sql, [type, breed, age, size, gender, monthly_cost || null, image_url, shelter_id], (err, result) => {
    if (err) {
      console.error("SQL 新增動物錯誤:", err);
      return res.status(500).json({ error: err.message });
    }

    const animalId = result.insertId;

    let traitList = [];
    if (req.body.traits) traitList = Array.isArray(req.body.traits) ? req.body.traits : [req.body.traits];
    traitList.forEach(traitID => {
      if (traitID) db.query('INSERT INTO animal_traits (animal_id, trait_id) VALUES (?, ?)', [animalId, traitID]);
    });

    res.json({ message: '動物新增成功', animal_id: animalId });
  });
});
// 取得動物列表
router.get('/admin/animals', (req, res) => {
  const sql = `
    SELECT a.*, s.name AS shelter_name
    FROM animals a
    LEFT JOIN shelters s ON a.shelter_id = s.id
    ORDER BY a.id DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL 讀取 animals 錯誤:", err);
      return res.status(500).json([]);
    }
    res.json(results);
  });
});


// 新增公告
router.post('/news', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "內容不可為空" });

  db.query("INSERT INTO news(content) VALUES(?)", [content], (err) => {
    if (err) {
      console.error("SQL 新增公告錯誤:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "公告新增成功" });
  });
});

// 取得公告列表
router.get('/news', (req, res) => {
  db.query("SELECT content FROM news ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("SQL 讀取公告錯誤:", err);
      return res.status(500).json([]); // 回傳空陣列，前端 map 不會炸
    }
    res.json(results);
  });
});

// 取得 shelter 列表
router.get('/shelters', (req, res) => {
  const sql = `
    SELECT 
      s.id,
      s.name,
      s.address,
      s.latitude,
      s.longitude,
      COUNT(a.id) AS available_animals
    FROM shelters s
    LEFT JOIN animals a 
      ON s.id = a.shelter_id AND a.adopted = 0
    GROUP BY s.id
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL 讀取 shelters 錯誤:", err);
      return res.status(500).json([]); // 回傳空陣列
    }
    res.json(results);
  });
});

export default router;
