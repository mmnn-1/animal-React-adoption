import multer from 'multer';
import path from 'path';
import express from 'express';

// multer 儲存設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // 上傳資料夾
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

// 產生 middleware
export const upload = multer({ storage });

// 對外公開資料夾
export const serveUploads = (app) => {
  app.use('/uploads', express.static('upload'));
};
