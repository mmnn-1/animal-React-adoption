import express from "express";
import { db } from "../db.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const router = express.Router();

// Multer memory storage (不存本地)
const upload = multer();

// Cloudinary 設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// -----------------------------
// 新增動物（含圖片 + traits）
// -----------------------------
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      type,
      breed,
      age,
      size,
      gender,
      monthly_cost,
      shelter_id,
      traits,
    } = req.body;

    // 必填欄位檢查
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

    const monthlyCostNum = Number(monthly_cost);
    const shelterIdNum = Number(shelter_id);

    // traits 可能是一個字串或陣列
    let traitList = traits || [];
    if (!Array.isArray(traitList)) traitList = [traitList];

    // -----------------------------
    // 圖片上傳到 Cloudinary
    // -----------------------------
    let imageUrl = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "animals" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
      imageUrl = result.secure_url;
    }

    // -----------------------------
    // 新增 animals
    // -----------------------------
    const sql = `
      INSERT INTO animals(type, breed, age, size, gender, monthly_cost, shelter_id, image_url, adopted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    db.query(
      sql,
      [type, breed, age, size, gender, monthlyCostNum, shelterIdNum, imageUrl],
      (err, result) => {
        if (err) {
          console.error("SQL 新增動物錯誤:", err);
          return res.status(500).json({ error: err.message });
        }

        const animalId = result.insertId;

        // -----------------------------
        // 新增 animal_traits
        // -----------------------------
        traitList.forEach((traitID) => {
          if (traitID) {
            db.query(
              "INSERT INTO animal_traits (animal_id, trait_id) VALUES (?, ?)",
              [animalId, traitID],
              (err) => {
                if (err) console.error("新增 trait 失敗", err);
              }
            );
          }
        });

        res.json({
          message: "動物新增成功",
          animal_id: animalId,
          imageUrl,
        });
      }
    );
  } catch (error) {
    console.error("POST /admin 發生錯誤:", error);
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// 取得動物列表
// -----------------------------
router.get("/", (req, res) => {
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

// -----------------------------
// 新增公告
// -----------------------------
router.post("/news", (req, res) => {
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

// -----------------------------
// 取得公告列表
// -----------------------------
router.get("/news", (req, res) => {
  db.query(
    "SELECT content FROM news ORDER BY created_at DESC",
    (err, results) => {
      if (err) {
        console.error("SQL 讀取公告錯誤:", err);
        return res.status(500).json([]);
      }
      res.json(results);
    }
  );
});

// -----------------------------
// 取得收容所列表
// -----------------------------
router.get("/shelters", (req, res) => {
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
      return res.status(500).json([]);
    }
    res.json(results);
  });
});

export default router;
