

color-trip/
├── node_modules/               //라이브러리설치
├── README.md
├── package-lock.json
├── package.json
├── public/                     //정적파일
│   ├── countries.geojson       //각 나라별 geojson
│   ├── index.html              //리액트 앱이 시작되는 Enrty
│   └── robots.txt             
└── src
    ├── App.tsx
    ├── components
    │   ├── Map.tsx             //지도 전용 컴포넌트 (App에서 불러다 씀) 
    │   └── SearchBar.tsx       //나라 혹은 도시 검색
    ├── data
    │   ├── cities.json
    │   └── countries.json
    ├── index.css
    ├── index.tsx
    ├── reportWebVitals.tsx
    └── types
        └── react-map-gl.d.ts   //타입 선언 (TS용)
        