import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

// Cloudinary 設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// 打印環境變數
console.log("Cloudinary Name:", process.env.CLOUDINARY_NAME);
console.log("Cloudinary Key:", process.env.CLOUDINARY_KEY ? "OK" : "undefined");
console.log("Cloudinary Secret:", process.env.CLOUDINARY_SECRET ? "OK" : "undefined");

// 嘗試列出 resources
cloudinary.api.resources({ max_results: 1 }, (error, result) => {
  if (error) {
    console.error("Cloudinary API 測試失敗:", error.message);
  } else {
    console.log("Cloudinary API 測試成功！", result);
  }
});
