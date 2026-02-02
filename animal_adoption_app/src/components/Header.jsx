// Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css"; // 可以自訂 CSS 或內嵌 style

export default function Header() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const userRole = localStorage.getItem("role");

  // 導覽按鈕點擊事件
  const goTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    alert("您已登出");
    navigate("/");
  };

  return (
    <nav className="header-nav">
      <ul className="nav-list">
        <li><button onClick={() => goTo("/")}>首頁</button></li>
        <li><button onClick={() => goTo("/#news")}>最新消息</button></li>
        <li><button onClick={() => goTo("/#map")}>浪浪據點</button></li>
        {!isLoggedIn && (
          <li><button onClick={() => goTo("/login")}>會員登入</button></li>
        )}
        {isLoggedIn && (
          <li><button onClick={() => goTo("/member")}>會員專區</button></li>
        )}
        <li><button onClick={() => goTo("/recommend")}>適合你的寵物推薦</button></li>
        {isLoggedIn && (
          <li><button onClick={handleLogout}>登出</button></li>
        )}
        {isLoggedIn && userRole === "admin" && (
          <li><button onClick={() => goTo("/dashboard")}>管理後台</button></li>
        )}
      </ul>
    </nav>
  );
}

