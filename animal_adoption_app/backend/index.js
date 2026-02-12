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

app.use(cors());
app.use(express.json());


// 路由
app.use('/user', userRoutes);
app.use('/animals', animalRoutes);
app.use('/admin', adminRoutes);
app.use("/api", recommendRoutes);
app.use('/', adoptRouter);

// 啟動
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
