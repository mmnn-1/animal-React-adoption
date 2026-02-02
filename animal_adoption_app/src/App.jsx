// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminNews from "./pages/AdminNews.jsx";  // <- 注意路徑和檔名
import Dashboard from "./pages/DashBoard.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AdminAddAnimal from "./pages/AdminAddAnimal.jsx";
import Member from "./pages/Member.jsx";
import Recommend from "./components/RecommendForm.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin/animals"element={<AdminAddAnimal />}/>
        <Route path="/member" element={<Member />} />
        <Route path="/recommend"element={<Recommend/>}/>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


