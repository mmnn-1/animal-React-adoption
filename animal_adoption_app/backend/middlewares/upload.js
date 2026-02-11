import multer from 'multer';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

// 取得目前資料夾路徑（ES Module 專用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 真正的 uploads 絕對路徑
const uploadPath = path.join(__dirname, '../uploads');

// multer 設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

// 對外公開 uploads
export const serveUploads = (app) => {
  app.use('/uploads', express.static(uploadPath));
};
