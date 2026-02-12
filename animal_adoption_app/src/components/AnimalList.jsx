import React, { useState, useEffect } from "react";
import AnimalCard from "./AnimalCard"; // 注意路徑
import { useNavigate } from "react-router-dom";
import './AnimalCard.css';


const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log("API_BASE_URL:", import.meta.env.VITE_API_URL);



const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${API_BASE_URL}/animals`)
      .then(res => res.json())
      .then(data => setAnimals(data))
      .catch(err => console.error(err));
  }, []);

  const adopt = (id, breed) => {
    if (localStorage.getItem("loggedIn") !== "true") {
      alert("請先登入才能領養！");
      navigate("/Login")
      return;
    }
    const userId = localStorage.getItem("userId");
    fetch(`${API_BASE_URL}/adopt`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, animal_id: id })
    })
    .then(res => res.json())
    .then(() => {
      alert(`你已成功領養 ${breed}！感謝你的愛心 💖`);
      setAnimals(prev => prev.filter(a => a.id !== id));
    });
  }

  return (
    <div id="animal-list">
      {animals.map(a => (
        <AnimalCard 
          key={a.id} 
          animal={a} 
          adopt={adopt} 
        />
      ))}
    </div>
  );
}

export default AnimalList;
