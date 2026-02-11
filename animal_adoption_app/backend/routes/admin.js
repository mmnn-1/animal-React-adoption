import express from 'express';
import { db } from '../db.js';
import { upload } from '../middlewares/upload.js'; 
const router = express.Router();


// 新增動物
router.post('/animals', upload.single('image'), (req, res) => {
  const { type, breed, age, size, gender, monthly_cost, shelter_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `INSERT INTO animals(type, breed, age, size, gender, monthly_cost, image_url, shelter_id, adopted)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`;

  db.query(sql, [type, breed, age, size, gender, monthly_cost || null, image_url, shelter_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    const animalId = result.insertId;

    let traitList = [];
    if (req.body.traits) traitList = Array.isArray(req.body.traits) ? req.body.traits : [req.body.traits];

    traitList.forEach(traitID => {
      if (traitID) db.query('INSERT INTO animal_traits (animal_id, trait_id) VALUES (?, ?)', [animalId, traitID]);
    });

    res.json({ message: '動物新增成功', animal_id: animalId });
  });
});
router.get('/animals', (req, res) => {
  const sql = `
    SELECT 
      a.*,
      s.name AS shelter_name
    FROM animals a
    LEFT JOIN shelters s ON a.shelter_id = s.id
    ORDER BY a.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("讀取動物錯誤:", err);
      return res.status(500).json({ error: "資料庫錯誤" });
    }

    res.json(results);
  });
});

// 新增公告
router.post('/news', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).send("內容不可為空");

  db.query("INSERT INTO news(content) VALUES(?)", [content], (err) => {
    if (err) return res.status(500).send("新增失敗");
    res.send("公告新增成功");
  });
});
// 取得公告列表（給前端用）
router.get('/news', (req, res) => {
  db.query(
    "SELECT content FROM news ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).send("讀取公告失敗");
      res.json(results);
    }
  );
});


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
      console.error(err);
      return res.status(500).json({ error: '資料庫錯誤' });
    }
    res.json(results);
  });
});


export default router;
