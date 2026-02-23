import { useEffect, useState } from "react";
import "./Member.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;
function Member() {
  const [adoptions, setAdoptions] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(`${API_BASE_URL}/my-adoptions?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setAdoptions(data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div className="container">
      <div className="profile">
        <h2>👤 我的會員檔案</h2>
        <p>歡迎回來！以下是你領養的浪浪 🐶🐱</p>
      </div>

      <div className="adoption-list">
        {adoptions.length === 0 ? (
          <p>目前沒有領養浪浪</p>
        ) : (
          adoptions.map(a => (
            <div className="adoption-card" key={a.id}>
              <img
                src={
                  a.image_url
                    ? a.image_url
                    : `${API_BASE_URL}/uploads/no-image.png`
                }
                alt={a.breed}
              />
              <h3>{a.breed} ({a.type})</h3>
              <p>年齡：{a.age ?? "未填寫"}</p>
              <p>體型：{a.size ?? "未填寫"}</p>
              <p>性別：{a.gender ?? "未填寫"}</p>
              <p>收容所：{a.shelter_name ?? "未填寫"}</p>
              <p>地址：{a.address ?? "未填寫"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Member;
