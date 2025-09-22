## 프로젝트 설명

빠니보틀 여행 앱 보고 꽂혀서 갑자기 만들기 시작한 프로젝트<br>
gpt 이용해서 로컬웹서비스 만들기!<br>
그동안 여행 갔다 왔던 곳 지도에 표시하고 통계도 내봐야지
<br>
<br>

## 프로젝트 구조

```plaintext
color-trip/
├── node_modules/               // 라이브러리 설치
├── README.md
├── package-lock.json
├── package.json
├── public/                     // 정적 파일
│   ├── countries.geojson       // 각 나라별 geojson
│   ├── index.html              // 리액트 앱이 시작되는 Entry
│   └── robots.txt
└── src
    ├── App.tsx
    ├── components
    │   ├── Map.tsx             // 지도 전용 컴포넌트 (App에서 불러다 씀)
    │   └── SearchBar.tsx       // 나라 혹은 도시 검색
    ├── data
    │   ├── cities
    │   │   ├── AFG.ts
    │   │   ├── ...
    │   │   └── ZWE.ts
    │   └── countries.ts
    ├── index.css
    ├── index.tsx
    ├── reportWebVitals.tsx
    └── types
        └── react-map-gl.d.ts   // 타입 선언 (TS용)
