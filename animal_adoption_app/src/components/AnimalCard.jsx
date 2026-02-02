import './AnimalCard.css';

function AnimalCard({ animal, adopt }) {
  return (
    <div className="animal-card">
      <div className='image-wrapper'>
        <img src={`http://localhost:3000${animal.image_url}`} alt={animal.breed} />
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

