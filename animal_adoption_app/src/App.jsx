// App.jsx
import { HashRouter, Routes, Route } from "react-router-dom";
import AdminNews from "./pages/AdminNews.jsx";  
import Dashboard from "./pages/DashBoard.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AdminAddAnimal from "./pages/AdminAddAnimal.jsx";
import Member from "./pages/Member.jsx";
import Recommend from "./components/RecommendForm.jsx";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin/animals"element={<AdminAddAnimal />}/>
        <Route path="/member" element={<Member />} />
        <Route path="/recommend"element={<Recommend/>}/>
        <Route path="/login" element={<Login />} />
      </Routes>
    </HashRouter>
  );
}

export default App;


