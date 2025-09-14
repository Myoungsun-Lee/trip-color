import React, { useState } from "react";

// 예시 나라/도시 데이터
const countriesAndCities = [
  { name: "South Korea", code: "KOR", lat: 37.5665, lng: 126.9780 },
  { name: "Seoul", code: "KOR", lat: 37.5665, lng: 126.9780 },
  { name: "Busan", code: "KOR", lat: 35.1796, lng: 129.0756 },
  { name: "Japan", code: "JPN", lat: 35.6895, lng: 139.6917 },
  { name: "Tokyo", code: "JPN", lat: 35.6895, lng: 139.6917 },
];

export default function SearchBar({
  // App에서 전달하는 callback prop 추가
  onUpdateVisited,
}: {
  onUpdateVisited: (countryCode: string, city: any) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof countriesAndCities>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    const filtered = value
      ? countriesAndCities.filter(item =>
          item.name.toLowerCase().includes(value.toLowerCase())
        )
      : [];
    setResults(filtered);
  };

  const handleSelectItem = (item: typeof countriesAndCities[0]) => {
    setSelectedItem(item);
    setIsSearchModalOpen(false); // 모달 닫기
  };

  const closeSelectedModal = () => setSelectedItem(null);

  const handleBeenClick = () => {
    if (!selectedItem) return;

    // App state 갱신 콜백 호출
    onUpdateVisited(selectedItem.code, selectedItem);

    closeSelectedModal();
    setIsSearchModalOpen(true); // 검색 모달 다시 열기
  };

  return (
    <>
      {/* 검색창 */}
      <input
        type="text"
        placeholder="Search for a country or city"
        onFocus={() => setIsSearchModalOpen(true)}
        readOnly
        style={{
          width: "200px",
          padding: "8px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      />

      {/* 검색 모달 */}
      {isSearchModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "400px",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setIsSearchModalOpen(false)}>X</button>
            </div>

            <input
              type="text"
              placeholder="Search for a country or city"
              value={query}
              onChange={handleChange}
              style={{ padding: "8px", fontSize: "16px" }}
            />

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {results.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectItem(item)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 선택 모달 */}
      {selectedItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "300px",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h2>{selectedItem.name}</h2>
            <button onClick={handleBeenClick}>Been</button>
            <button onClick={closeSelectedModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
