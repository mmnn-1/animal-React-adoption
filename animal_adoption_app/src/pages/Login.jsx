import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // 單獨 CSS
const API_BASE_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const navigate = useNavigate();

  // 登入
  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      alert("請輸入帳號與密碼");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/user/login`, { // 注意後端 port
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });

      if (!res.ok) {
        const text = await res.text();
        alert(text);
        return;
      }

      const data = await res.json();
      alert(data.msg);

      // 儲存登入狀態
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);

      // 依角色跳轉
      if (data.role === "admin") {
        navigate("/DashBoard");//admin頁面
      } else {
        navigate("/"); // Home
      }

    } catch (err) {
      console.error(err);
      alert("登入失敗，請稍後再試");
    }
  };

  // 註冊
  const handleRegister = async () => {
    if (!registerUsername || !registerPassword) {
      alert("請輸入帳號與密碼");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: registerUsername, password: registerPassword })
      });

      const text = await res.text();
      alert(text);

    } catch (err) {
      console.error(err);
      alert("註冊失敗，請稍後再試");
    }
  };

  return (
    <div className="login-page">
      <h1>會員登入 / 註冊</h1>

      <div className="form-box">
        <h2>註冊</h2>
        <input
          type="text"
          placeholder="帳號"
          value={registerUsername}
          onChange={e => setRegisterUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="密碼"
          value={registerPassword}
          onChange={e => setRegisterPassword(e.target.value)}
        />
        <button onClick={handleRegister}>註冊</button>
      </div>

      <div className="form-box">
        <h2>登入</h2>
        <input
          type="text"
          placeholder="帳號"
          value={loginUsername}
          onChange={e => setLoginUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="密碼"
          value={loginPassword}
          onChange={e => setLoginPassword(e.target.value)}
        />
        <button onClick={handleLogin}>登入</button>
      </div>
    </div>
  );
}

export default Login;
