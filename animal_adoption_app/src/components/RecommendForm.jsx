import { useState } from "react";
import"./recommendForm.css";


const TRAITS=[
    {id : 1,key:"friendly",label:"親人"},
    {id : 2,key:"active",label:"活潑"},
    {id : 3,key:"calm",label:"安靜"},
    {id : 4,key:"good_with_kids",label:"適合小孩"},
    {id : 5,key:"low_barking",label:"不愛叫"},

];

export default function Recommend(){
    const [formData,setFormData] = useState({
        type:"",
        avg_monthly_cost:"3000",
        activity_level:"low",
        space_requirement:"low",
        noice_level:"low",
        shedding_level:"low",
        time_commitment:"low",
        suitable_for:"beginner",
        traits:[],
    });
    const [results,setResults]=useState([]);
    //表單欄位改變
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormData((prev)=>({...prev,[name]:value}));
    };
    //checkbox多選

    const handleCheckboxChange=(e)=>{
        const {value,checked}=e.target;
       setFormData((prev) => ({
      ...prev,
      traits: checked
        ? [...prev.traits, value]
        : prev.traits.filter((t) => t !== value),
    }));
  };

  // 送出問卷
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("fetch 回傳狀態：", res.status);
      setResults(data); // 後端回傳包含 score 的推薦結果
       console.log("fetch 回傳資料：", data);
    } catch (err) {
      console.error(err);
      alert("推薦出現錯誤");
    }
  };

  return (
    <div className="recommend-container">
      <h1>🐾 適合你的寵物推薦</h1>
      <p className="subtitle">回答以下問題，我會推薦適合你的動物</p>

      <form onSubmit={handleSubmit}>
        {/* 基本條件 */}
        <section>
          <h2>基本條件</h2>
          <label>想領養的類型</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">請選擇</option>
            <option value="dog">狗</option>
            <option value="cat">貓</option>
          </select>

          <label>每個月可以接受的花費</label>
          <select
            name="avg_monthly_cost"
            value={formData.avg_monthly_cost}
            onChange={handleChange}
          >
            <option value="3000">3000以下</option>
            <option value="6000">3000-6000</option>
            <option value="10000">6000以上</option>
          </select>
        </section>

        {/* 生活習慣 */}
        <section>
          <h2>生活習慣</h2>
          <label>每天可陪伴運動的時間</label>
          <select
            name="activity_level"
            value={formData.activity_level}
            onChange={handleChange}
          >
            <option value="low">少</option>
            <option value="medium">中等</option>
            <option value="high">多</option>
          </select>

          <label>居住空間</label>
          <select
            name="space_requirement"
            value={formData.space_requirement}
            onChange={handleChange}
          >
            <option value="low">套房/小公寓</option>
            <option value="medium">一般住宅</option>
            <option value="high">大空間/有庭院</option>
          </select>

          <label>對吵鬧的接受度</label>
          <select
            name="noice_level"
            value={formData.noice_level}
            onChange={handleChange}
          >
            <option value="low">很怕吵</option>
            <option value="medium">普通</option>
            <option value="high">不介意</option>
          </select>
        </section>

        {/* 照顧與整理 */}
        <section>
          <h2>照顧與整理</h2>
          <label>整理毛髮接受度</label>
          <select
            name="shedding_level"
            value={formData.shedding_level}
            onChange={handleChange}
          >
            <option value="low">不太能</option>
            <option value="medium">可以</option>
            <option value="high">完全接受</option>
          </select>

          <label>每天能投入照顧時間</label>
          <select
            name="time_commitment"
            value={formData.time_commitment}
            onChange={handleChange}
          >
            <option value="low">很少</option>
            <option value="medium">普通</option>
            <option value="high">很多</option>
          </select>

          <label>是否第一次養寵物</label>
          <select
            name="suitable_for"
            value={formData.suitable_for}
            onChange={handleChange}
          >
            <option value="beginner">是</option>
            <option value="experienced">否</option>
          </select>
        </section>

        {/* 偏好個性 */}
        <section>
          <h2>偏好個性（可複選）</h2>
          <div className="checkbox-group">
            {TRAITS.map((trait) => (
              <label key={trait.id}>
                <input
                  type="checkbox"
                  value={trait.key}
                  checked={formData.traits.includes(trait.key)}
                  onChange={handleCheckboxChange}
                />
                {trait.label}
              </label>
            ))}
          </div>
        </section>

        <button type="submit">開始推薦</button>
      </form>

      {/* 推薦結果 */}
      {results.length > 0 && (
        <div className="result-section">
          <h2>🐶 為你推薦的寵物（前三名）</h2>
          <div className="result-list">
            {results
              .sort((a, b) => b.score - a.score)
              .slice(0, 3)
              .map((animal) => (
                <div key={animal.id} className="animal-card">
                  <img
                    src={`http://localhost:3000${animal.image_url}`}
                    alt={animal.breed}
                  />
                  <h3>
                    {animal.breed} ({animal.type})
                  </h3>
                  <p>年齡：{animal.age}</p>
                  <p>性別：{animal.gender}</p>
                  <p>每月費用：{animal.monthly_cost}</p>
                  <p>收容所：{animal.shelter_name}</p>
                  <p>推薦分數：{animal.score}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
    


