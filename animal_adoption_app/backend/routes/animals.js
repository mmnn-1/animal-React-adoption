import express from 'express';
import { db } from '../db.js';
import { calculateScore } from '../services/Recommendservices.js';

const router = express.Router();


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
