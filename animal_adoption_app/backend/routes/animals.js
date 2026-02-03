import express from 'express';
import multer from 'multer';
import path from 'path';
import { db } from '../db.js';
import { calculateScore } from '../services/Recommendservices.js';

const router = express.Router();

// multer 設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'upload/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
router.use('/uploads', express.static('upload'));

// 取得所有動物
router.get('/', (req, res) => {
  const sql = `
    SELECT a.id, a.type, a.breed, a.age, a.size, a.gender, a.monthly_cost, a.image_url,
           s.name AS shelter_name, s.address, s.latitude, s.longitude
    FROM animals a
    JOIN shelters s ON a.shelter_id = s.id
    WHERE a.adopted = 0
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("資料庫錯誤");
    res.json(results);
  });
});

// 領養
router.post('/adopt', (req, res) => {
  const { user_id, animal_id } = req.body;
  db.query("INSERT INTO adoptions(user_id, animal_id) VALUES (?, ?)", [user_id, animal_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    db.query("UPDATE animals SET adopted=1 WHERE id=?", [animal_id], (err2) => {
      if (err2) return res.status(500).json({ error: err2 });
      res.json({ msg: "領養成功!" });
    });
  });
});

// 推薦 API
router.post('/recommend', (req, res) => {
  const user = req.body;
  db.query("SELECT * FROM animal_profiles", [], (err, animals) => {
    if (err) return res.status(500).json(err);
    const results = animals.map(animal => {
      const { score, reason } = calculateScore(animal, user);
      return { ...animal, score, reason };
    });
    results.sort((a, b) => b.score - a.score);
    res.json(results.slice(0, 3));
  });
});

export default router;
