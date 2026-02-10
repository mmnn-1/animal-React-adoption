import './AnimalCard.css';
const API_BASE_URL = import.meta.env.VITE_API_URL;

function AnimalCard({ animal, adopt }) {
  return (
    <div className="animal-card">
      <div className='image-wrapper'>
        <img src={`${API_BASE_URL}${animal.image_url}`} alt={animal.breed} />
      </div>
      <h3>{animal.breed} ({animal.type})</h3>
      <p>年齡：{animal.age}</p>
      <p>性別：{animal.gender}</p>
      <p>每月費用：{animal.monthly_cost}</p>
      <p>收容所:{animal.shelter_name}</p>
      <button onClick={() => adopt(animal.id, animal.breed)}>領養我</button>
    </div>
  );
}

export default AnimalCard;

