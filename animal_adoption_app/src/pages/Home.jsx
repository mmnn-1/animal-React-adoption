import Header from "../components/Header";
import NewsMarquee from "../components/NewsMarquee";
import AnimalList from "../components/AnimalList";
import MapSection from "../components/MapSection";

import "./Home.css";
import dogImage from "../assets/dog.jpg";

function Home() {
  return (
    <div className="home">
      <Header />  {/* 🟢 這裡加入導覽列 */}
      <NewsMarquee />
     <section className="hero">
  <div className="hero-text">
    <h1 className="hero-title">給牠一個家 🐾</h1>
    <p className="hero-subtitle">
      目前有這些可愛的浪浪，正在等待你的擁抱
    </p>
    <button className="hero-btn">立即看看浪浪</button>
  </div>

  <div className="hero-image">
    <img src={dogImage} alt="可愛狗狗" />
  </div>
</section>
    </div>
  );
}

export default Home;
