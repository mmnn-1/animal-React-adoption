
// AdminNews.jsx
import React, { useState, useEffect } from "react";

export default function AdminNews() {
  const [newsContent, setNewsContent] = useState("");
  const [newsList, setNewsList] = useState([]);

  const loadNews = async () => {
    const res = await fetch("http://localhost:3000/admin/news");
    const data = await res.json();
    setNewsList(data);
  };

  const addNews = async () => {
    if (!newsContent.trim()) {
      alert("公告內容不能為空");
      return;
    }

    const res = await fetch("http://localhost:3000/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newsContent })
    });

    if (res.ok) {
      alert("公告新增成功！");
      setNewsContent("");
      loadNews();
    } else {
      alert("新增失敗");
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 30, background: "white", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
      <h2>新增公告</h2>
      <textarea
        style={{ width: "100%", height: 120, padding: 10, fontSize: 16, borderRadius: 5, border: "1px solid #ccc", resize: "vertical" }}
        placeholder="請輸入公告內容（會顯示在首頁跑馬燈）"
        value={newsContent}
        onChange={(e) => setNewsContent(e.target.value)}
      ></textarea>
      <br />
      <button
        style={{ marginTop: 15, backgroundColor: "#ff8c42", color: "white", border: "none", padding: "10px 20px", borderRadius: 5, fontSize: 16, cursor: "pointer" }}
        onClick={addNews}
      >
        新增公告
      </button>

      <div style={{ marginTop: 30 }}>
        <h3>目前公告</h3>
        {newsList.map((n, i) => (
          <div key={i} style={{ background: "#fff8f4", padding: 12, borderRadius: 5, marginBottom: 10 }}>
            {n.content}
          </div>
        ))}
      </div>
    </div>
  );
}
