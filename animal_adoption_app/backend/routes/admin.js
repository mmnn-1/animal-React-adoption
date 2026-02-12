import express from 'express';
import { db } from '../db.js';
//import { upload } from '../cloudinary.js';
const router = express.Router();




router.post('/', async (req, res) => {
  try {
    console.log("收到 POST /admin /req.body:", req.body);

    const { type, breed, age, size, gender, monthly_cost, shelter_id, traits } = req.body;
if (
  type == null || 
  breed == null || 
  age == null || 
  size == null || 
  gender == null || 
  monthly_cost == null || 
  shelter_id == null
) {
  return res.status(400).json({ error: "缺少必要欄位" });
}


    const sql = `
      INSERT INTO animals(type, breed, age, size, gender, monthly_cost, shelter_id, adopted)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `;

    db.query(
      sql,
      [type, breed, age, size, gender, monthly_cost || null, shelter_id],
      (err, result) => {
        if (err) {
          console.error("SQL 新增動物錯誤:", err);
          return res.status(500).json({ error: err.message });
        }

        const animalId = result.insertId;
        console.log("新增動物成功, ID:", animalId);

        // 處理 traits
        let traitList = [];
        if (traits) {
          traitList = Array.isArray(traits) ? traits : [traits];
          traitList.forEach(traitID => {
            if (traitID) {
              db.query(
                'INSERT INTO animal_traits (animal_id, trait_id) VALUES (?, ?)',
                [animalId, traitID],
                (err) => {
                  if (err) console.error("新增 trait 失敗", err);
                }
              );
            }
          });
        }

        res.json({ message: "動物新增成功 (暫無圖片)", animal_id: animalId });
      }
    );
  } catch (error) {
    console.error("POST /admin 發生錯誤:", error);
    res.status(500).json({ error: error.message });
  }
});

// 取得動物列表
router.get('/', (req, res) => {
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
