import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.js';
import animalRoutes from './routes/animals.js';
import adminRoutes from './routes/admin.js';
import recommendRoutes from "./routes/recommend.js";
import adoptRouter from './routes/adopt.js';

const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------
// CORS 設定
// -----------------------------
app.use(cors({
  origin: "https://animal-react-adoption.vercel.app", // 只允許你的前端網域
  methods: ["GET", "POST", "PUT", "DELETE"],         // 允許 HTTP 方法
  credentials: true                                  // 如果你前端要傳 cookie
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 若前端使用 FormData 會用到

// -----------------------------
// 路由
// -----------------------------
app.use('/user', userRoutes);
app.use('/animals', animalRoutes);
app.use('/admin', adminRoutes);
app.use("/api", recommendRoutes);
app.use('/', adoptRouter);

// -----------------------------
// 啟動
// -----------------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
