import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = localStorage.getItem("loggedIn") === "true";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li><Link to="/">首頁</Link></li>
        <li><Link to="/news">最新消息</Link></li>
        <li><Link to="/recommend">適合你的寵物推薦</Link></li>

        {/* 右側登入 / 登出 */}
        <li className="nav-right">
          {!loggedIn && <Link to="/login">會員登入</Link>}

          {loggedIn && (
            <>
              <Link to="/member">會員專區</Link>
              <button className="logout-btn" onClick={handleLogout}>
                登出
              </button>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
