
import {MapContainer,TileLayer,Marker,Popup}from "react-leaflet";
import { useEffect, useState } from "react";
//import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapSection() {
 
    const [shelters,setShelters] = useState([]);

    useEffect(()=>{
      fetch("http://localhost:3000/shelters")
      .then(res=>res.json())
      .then(data=>setShelters(data))
      .catch(err=>console.error(err));
    },[]);
    return (
      <MapContainer
      center={[23.9678,120.9605]}
      zoom={7}
      style={{height:"400px",width:"100%"}}
      >
            <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {shelters.map(shelter => (
        shelter.latitude && shelter.longitude && (
          <Marker
            key={shelter.id}
            position={[shelter.latitude, shelter.longitude]}
          >
            <Popup>
              <strong>{shelter.name}</strong><br />
              📍 {shelter.address}<br />
              🐾 可領養：{shelter.available_animals} 隻
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}
    
   
  

export default MapSection;
