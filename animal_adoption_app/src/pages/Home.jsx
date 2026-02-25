import Header from "../components/Header";
import NewsMarquee from "../components/NewsMarquee";
import AnimalList from "../components/AnimalList";
import MapSection from "../components/MapSection";

import "./Home.css";
import dogImage from "../assets/dogcat.jpg";

function Home() {
  return (
    <div className="home">
      <Header />  
      <NewsMarquee />

      {/* Hero 區 */}
      <section className="hero">
        <div className="hero-text">
          <h1 className="hero-title">給牠一個家 🐾</h1>
          <p className="hero-subtitle">
            目前有這些可愛的浪浪，正在等待你的擁抱
          </p>
        </div>
        <div className="hero-image">
          <img src={dogImage} alt="可愛狗狗" />
        </div>
      </section>

      {/* 動物列表 */}
      <section className="content">
        <AnimalList />
      </section>

      {/* 地圖區 */}
      <section className="map-section">
        <h2>收養地點分佈</h2>
        <MapSection />
      </section>
    </div>
  );
}

export default Home;