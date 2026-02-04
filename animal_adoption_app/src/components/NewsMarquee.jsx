import React, { useEffect, useState } from "react";

export default function NewsMarquee() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/news");
        const data = await res.json();
        setNewsList(data);
      } catch (err) {
        console.error("載入公告失敗", err);
      }
    };

    fetchNews();

    // 選擇性：每 30 秒自動刷新公告
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  if (newsList.length === 0) return null; // 沒公告就不顯示

  return (
    <marquee style={{ backgroundColor: "#ff8c42", padding: "10px 0" }}>
      {newsList.map((n, i) => (
        <span key={i} style={{ marginRight: 50 }}>{n.content}</span>
      ))}
    </marquee>
  );
}
