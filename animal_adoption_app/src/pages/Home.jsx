import Header from "../components/Header";
import NewsMarquee from "../components/NewsMarquee";
import AnimalList from "../components/AnimalList";
import MapSection from "../components/MapSection";

import "./Home.css";

function Home() {
  return (
    <div className="home">
      <Header />  {/* 🟢 這裡加入導覽列 */}
      <NewsMarquee />
      <section className="hero">
        <h1 className="hero-title">給牠一個家 🐾</h1>
        <p className="hero-subtitle">
          目前有這些可愛的浪浪，正在等待你的擁抱
        </p>
      </section>
      <section className="content">
        <AnimalList />
      </section>
      <section className="map-section">
        <h2>收養地點分佈</h2>
        <MapSection />
      </section>
    </div>
  );
}

export default Home;
