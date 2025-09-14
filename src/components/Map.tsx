import React, { useState, useEffect } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = "ENTER_YOUT_MAPBOX_TOKEN";

const MyMap = ({ visitedCities }: { visitedCities: any }) => {
  const [zoom, setZoom] = useState(2);
  const [countriesData, setCountriesData] = useState<any>(null);

  // public/countries.geojson fetch
  useEffect(() => {
    fetch('/countries.geojson')
      .then(res => res.json())
      .then(data => setCountriesData(data))
      .catch(err => console.error('Failed to load countries.geojson', err));
  }, []);

  if (!countriesData) return <div>Loading map...</div>;

  // 방문한 나라 코드 목록
  const visitedCountryCodes = Object.keys(visitedCities); // ['KOR','USA',...]

  // 방문한 나라만 필터링
  const filteredCountries = {
    type: "FeatureCollection",
    features: countriesData.features.filter(
      (f: any) => visitedCountryCodes.includes(f.properties.ISO_A3)
    ),
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Map
        initialViewState={{ latitude: 20, longitude: 0, zoom: 2 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={evt => setZoom(evt.viewState.zoom)}
      >
        {/*방문한 나라 영역 색칠 (줌 6 이하에서만 보이도록)*/}
        {zoom <= 6 && (
          <Source
            id="visited-countries"
            type="geojson"
            data={filteredCountries} 
          >
            <Layer
              id="visited-countries-fill"
              type="fill"
              paint={{ 'fill-color': '#87CEFA', 'fill-opacity': 0.5 }}
            />
            <Layer
              id="visited-countries-outline"
              type="line"
              paint={{ 'line-color': '#1E90FF', 'line-width': 1 }}
            />
          </Source>
        )}

        {/* 도시 Marker */}
        {zoom > 6 && Object.values(visitedCities).flat().map((city: any) => (
          <Marker key={city.name} latitude={city.lat} longitude={city.lng}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '500%',
              backgroundColor: 'rgba(135, 206, 250, 0.5)',
              border: '2px solid #1E90FF',
            }} />
          </Marker>
        ))}
      </Map>

      {/* 줌 레벨 표시 박스 (오른쪽 아래) */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          background: "rgba(0, 0, 0, 0.4)",
          color: "white",
          padding: "5px 10px",
          borderRadius: "8px",
          fontSize: "14px",
          pointerEvents: "none",
        }}
      >
        Zoom: {zoom.toFixed(2)}
      </div>
    </div>
  );

};

export default MyMap;
