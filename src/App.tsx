import React, { useState } from "react";
import SearchBar from "./components/SearchBar.tsx";
import MyMap from "./components/Map.tsx";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const [visitedCities, setVisitedCities] = useState<any>(() => {
    const stored = localStorage.getItem("visitedCities");
    return stored ? JSON.parse(stored) : {};
  });

  // SearchBar가 호출할 callback
  const handleUpdateVisited = (countryCode: string, city: any) => {
    setVisitedCities((prev: any) => {
      const updated = { ...prev };
      if (!updated[countryCode]) updated[countryCode] = [];
      if (!updated[countryCode].some((c: any) => c.name === city.name)) {
        updated[countryCode].push(city);
      }

      localStorage.setItem("visitedCities", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="container">
      <header className="search">
        <SearchBar onUpdateVisited={handleUpdateVisited} />
      </header>

      <main className="map">
        <MyMap visitedCities={visitedCities} />
      </main>

      <footer className="mytrip">
        <button>My Trip</button>
      </footer>
    </div>
  );
}

export default App;
