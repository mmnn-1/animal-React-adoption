import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";

const cards = [
  {
    icon: "🐶",
    title: "新增可領養動物",
    desc: "上架新的浪浪資料",
    colorClass: "animal",
    link: "/admin/animals"
  },
  {
    icon: "📢",
    title: "公告 / 跑馬燈管理",
    desc: "編輯首頁公告",
    colorClass: "news",
    link: "/admin/news"
  },
  {
    icon: "🏠",
    title: "回前台首頁",
    desc: "查看使用者畫面",
    colorClass: "home",
    link: "/"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const role = localStorage.getItem("role");
    if (loggedIn !== "true" || role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <header>🛠 管理者後台 Dashboard</header>
      <div className="dashboard">
        {cards.map((card, i) => (
          <div key={i} className="card" onClick={() => navigate(card.link)}>
            <div className={`icon ${card.colorClass}`}>{card.icon}</div>
            <div className="title">{card.title}</div>
            <div className="desc">{card.desc}</div>
          </div>
        ))}
      </div>
    </>
  );
}

