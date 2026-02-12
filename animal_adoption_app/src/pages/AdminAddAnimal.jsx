import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAddAnimal.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminAddAnimal() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [shelters, setShelters] = useState([]);
  const TRAITS = [
  { id: 1, key: "friendly", label: "親人" },
  { id: 2, key: "shy", label: "害羞" },
  { id: 3, key: "active", label: "活潑" },
  { id: 4, key: "calm", label: "安靜" },
  { id: 5, key: "good_with_kids", label: "適合有小孩家庭" },
  { id: 6, key: "apartment_friendly", label: "適合公寓" },
  { id: 7, key: "low_barking", label: "不愛吠叫" },
  { id: 8, key: "high_energy", label: "高活動力" },
];


  // 權限檢查
  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      alert("無權限存取");
      navigate("/");
    }
  }, [navigate]);

  // 載入收容所
  useEffect(() => {
    loadShelters();
  }, []);

  const loadShelters = async () => {
    const res = await fetch(`${API_BASE_URL}/admin/shelters`);
    const data = await res.json();
    setShelters(data);
  };

  // 送出表單
  const submitAnimal = async () => {
    const formData = new FormData(formRef.current);

    const res = await fetch(`${API_BASE_URL}/animals`, {
      method: "POST",
      body: formData,
    });

    const msg = await res.text();
    alert(msg);
    formRef.current.reset();
  };

  return (
    <div className="admin-container">
      <h2 className="form-title">新增動物資料</h2>
      <form ref={formRef} encType="multipart/form-data" className="animal-form">
        <div className="form-group">
          <label>種類</label>
          <select name="type">
            <option value="dog">狗</option>
            <option value="cat">貓</option>
          </select>
        </div>

        <div className="form-group">
          <label>品種</label>
          <input type="text" name="breed" required />
        </div>

        <div className="form-group">
          <label>年齡</label>
          <select name="age">
            <option value="baby">幼年</option>
            <option value="adult">成年</option>
            <option value="senior">老年</option>
          </select>
        </div>

        <div className="form-group">
          <label>體型</label>
          <select name="size">
            <option value="small">小型</option>
            <option value="medium">中型</option>
            <option value="large">大型</option>
          </select>
        </div>

        <div className="form-group">
          <label>性別</label>
          <select name="gender">
            <option value="male">公</option>
            <option value="female">母</option>
          </select>
        </div>

        <div className="form-group">
          <label>每月費用</label>
          <input type="number" name="monthly_cost" required />
        </div>

        <div className="form-group">
          <label>圖片</label>
          <input type="file" name="image" />
        </div>

        <div className="form-group">
          <label>收容所</label>
          <select name="shelter_id" required>
            <option value="">請選擇收容所</option>
            {shelters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

       <div className="form-group traits-group">
       <h3>特徵</h3>
        {TRAITS.map((trait) => (
        <label key={trait.id} className="trait-label">
        <input
            type="checkbox"
            name="traits"
            value={trait.id}
        />
        {trait.label}
        </label>
  ))}
</div>


        <button type="button" className="submit-btn" onClick={submitAnimal}>
          新增動物
        </button>
      </form>
    </div>
  );
}
