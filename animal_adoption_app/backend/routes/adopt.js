import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// POST /adopt
router.post('/adopt', (req, res) => {
  const { user_id, animal_id } = req.body;
  if (!user_id || !animal_id) return res.status(400).json({ error: "缺少 user_id 或 animal_id" });

  db.query(
    "INSERT INTO adoptions(user_id, animal_id) VALUES (?, ?)",
    [user_id, animal_id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      db.query(
        "UPDATE animals SET adopted=1 WHERE id=?",
        [animal_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2 });
          res.json({ msg: "領養成功!" });
        }
      );
    }
  );
});

// GET /my-adoptions?user_id=2
router.get('/my-adoptions', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: "缺少 user_id" });

  const sql = `
    SELECT a.id, a.breed, a.type, a.age, a.size, a.gender, a.image_url,
           s.name AS shelter_name, s.address
    FROM adoptions AS ad
    JOIN animals AS a ON ad.animal_id = a.id
    JOIN shelters AS s ON a.shelter_id = s.id
    WHERE ad.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

export default router;

