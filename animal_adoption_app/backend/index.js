import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';


const app = express();
const port = 3000;
const saltRounds = 10;

app.use(cors());  // 這行加上去，允許所有來自不同來源的請求


app.use(express.json());
import { calculateScore } from './services/Recommendservices.js';


// 資料庫連線設定nod
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mm8780461', // ✅ 改成你自己 MySQL 的密碼
  database: 'qq'   // ✅ 改成你建立的資料庫名稱
});

// 測試連線
db.connect((err) => {
  if (err) {
    console.error('資料庫連線失敗：', err);
  } else {
    console.log('已連線到資料庫');
  }
});
// 註冊 API
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // 先檢查帳號是否已存在
  db.query('SELECT * FROM users WHERE username = ?', [username], async(err, results) => {
    if (err) return res.status(500).send('資料庫錯誤');

    if (results.length > 0) {
      return res.status(400).send('帳號已存在');
    }
    try {
      //雜湊密碼
      const hashed = await bcrypt.hash(password,saltRounds);
      // 新增帳號
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], (err, results) => {
      if (err) return res.status(500).send('註冊失敗');
      res.send('註冊成功');
    });
    } catch (error) {
      res.status(500).send('伺服器錯誤');
    }
    
    });
  });


// 登入 API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT  id,username,password,role FROM users WHERE username = ?',
    [username],
    async(err, results) => {
    if (err) return res.status(500).send('資料庫錯誤');
    if(results.length===0)return res.status(401).send('帳號或密碼錯誤')
    const user = results[0];

    const match = await bcrypt.compare(password,user.password);
    if(!match)return res.status(401).send('帳號或密碼錯誤');
    res.json({
      msg:"登入成功",
      userId:user.id,
      role:user.role
    });
    });
});
//圖片上傳設定

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'upload/');
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+path.extname(file.originalname));
  }
});
const upload = multer({storage});
//對外公開資料夾
app.use('/uploads',express.static('upload'));
app.post('/admin/animals', upload.single('image'), (req, res) => {
  const { type, breed, age, size, gender, monthly_cost, shelter_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO animals(type, breed, age, size, gender, monthly_cost, image_url, shelter_id, adopted)
    VALUES(?,?,?,?,?,?,?,?,0)
  `;

  db.query(
    sql,
    [type, breed, age, size, gender, monthly_cost || null, image_url, shelter_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: '新增失敗', details: err });

      const animalId = result.insertId;

      // 處理 traits
      let traitList = [];
      if (req.body.traits) {
        traitList = Array.isArray(req.body.traits) ? req.body.traits : [req.body.traits];
      }

      traitList.forEach(traitID => {
        if(traitID){
          db.query(
            'INSERT INTO animal_traits (animal_id, trait_id) VALUES (?, ?)',
            [animalId, traitID],
            (err) => { if(err) console.error("新增 trait 失敗:", err); }
          );
        }
      });

      res.json({ message: '動物新增成功', animal_id: animalId });
    }
  );
});

app.get('/animals', (req,res)=>{
  const sql = `
    SELECT 
      a.id,
      a.type,
      a.breed,
      a.age,
      a.size,
      a.gender,
      a.monthly_cost,
      a.image_url,
      s.name AS shelter_name,
      s.address,
      s.latitude,
      s.longitude
    FROM animals a
    JOIN shelters s ON a.shelter_id = s.id
    WHERE a.adopted = 0
  `;

  db.query(sql,(err,results)=>{
    if(err) return res.status(500).send("資料庫錯誤");
    res.json(results);
  });
});
app.get('/shelters',(req,res)=>{
  const sql=`
  SELECT
  s.id,
  s.name,
  s.address,
  s.latitude,
  s.longitude,
  COUNT(a.id)AS available_animals
  FROM shelters s
  LEFT JOIN animals a
  ON a.shelter_id = s.id
  AND a.adopted=0
  GROUP BY s.id
  `;

  db.query(sql,(err,results)=>{
    if(err)return res.status(500).send("資料庫錯誤");
    res.json(results);
  });
});

app.post("/adopt",(req,res)=>{
  const {user_id,animal_id} = req.body;
//寫入領養紀錄
  const insertsql = "INSERT INTO adoptions(user_id,animal_id)VALUES(?,?)";
  db.query(insertsql,[user_id,animal_id],(err,result)=>{
    if(err)return res.status(500).json({error:err});
    //更新領養狀態為已領養
    const updatesql = "UPDATE animals SET adopted=1 WHERE id=?";
    db.query(updatesql,[animal_id],(err2,result)=>{
      if(err2)return res.status(500).json({error:err2});
      res.json({msg:"領養成功!"});
    })
    
  });
  
});
app.get("/my-adoptions",(req,res)=>{
  const userId = req.query.user_id;
  const sql = `
  SELECT a.id,a.type,a.breed,a.age,a.size,a.gender,a.monthly_cost,a.image_url,s.name AS shelter_name,s.address,
  GROUP_concat(t.name SEPARATOR',')AS traits
  FROM adoptions ad
  JOIN animals a ON ad.animal_id = a.id
  JOIN shelters s ON a.shelter_id = s.id
  LEFT JOIN animal_traits at ON a.id = at.animal_id
  LEFT JOIN traits t ON at.trait_id = t.id
  where ad.user_id=?
  GROUP BY a.id
  `;
  db.query(sql,[userId],(err,rows)=>{
  if(err)return res.status(500).json({error:err});
  res.json(rows);
});
});
app.get('/admin/shelters',(req,res)=>{
  const sql =`
  select id,name
  FROM shelters
  ORDER by name
  `;
  db.query(sql,(err,results)=>{
    if(err)return res.status(500).json({error:資料庫錯誤});
    res.json(results);
  }

  );
});
app.post('/admin/news',(req,res)=>{
  const {content} = req.body;
  db.query(
    'INSERT INTO news(content)VALUES(?)',
    [content],
    err=>{
      if(err)return res.status(500).send("新增失敗");
      res.send("公告新增成功");
    }
  );
});
app.get('/news',(req,res)=>{
  db.query(
    'SELECT content FROM news ORDER BY created_at DESC',
    (err,rows)=>{
      if(err)return res.status(500).send("錯誤");
      res.json(rows);
    }
  );
});
app.post("/admin/news", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).send("內容不可為空");
  }

  try {
    await db.query(
      "INSERT INTO news (content) VALUES (?)",
      [content]
    );
    res.send("公告新增成功");
  } catch (err) {
    console.error(err);
    res.status(500).send("新增失敗");
  }
});



app.post("/api/recommend", (req,res)=>{
  const user = req.body;
  db.query("SELECT * FROM animal_profiles", [], (err, animals)=>{
    if(err) return res.status(500).json(err);

    const results = animals.map(animal => {
      const { score, reason } = calculateScore(animal, user);
      return { ...animal, score, reason };
    });

    // 排序並只取前三名
    results.sort((a,b)=>b.score - a.score);
    res.json(results.slice(0,3));
  });
});

app.listen(port, () => {
  console.log(`後端服務啟動：http://localhost:${port}`);
});
