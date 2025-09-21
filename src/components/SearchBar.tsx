import React, { useState } from "react";
import { countries } from "../data/countries.ts";

type Country = { name: string; code: string };
type City = { name: string; countryCode: string; lat: number; lng: number };

export default function SearchBar({
    onUpdateVisited,
}: {
    onUpdateVisited: (countryCode: string, city: any) => void;
}) {
    const [query, setQuery] = useState("");
    const [currentTab, setCurrentTab] = useState<"Countries" | "Cities">("Countries");
    const [results, setResults] = useState<Array<Country | City>>(countries);
    const [isSearchPageOpen, setIsSearchPageOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Country | City | null>(null);
    const [selectedCountryForCities, setSelectedCountryForCities] = useState<Country | null>(null);
    const [cityList, setCityList] = useState<City[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            if (currentTab === "Countries") {
                setResults(countries);
            } else {
                // Cities 탭일 때
                if (selectedCountryForCities) {
                    setResults(cityList); // 선택한 나라 도시 리스트
                } else {
                    setResults(countries); // 초기 화면은 나라 리스트
                }
            }
        } else {
            const listToFilter =
                currentTab === "Countries"
                    ? countries
                    : selectedCountryForCities
                        ? cityList
                        : countries;
            const filtered = listToFilter.filter(item =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setResults(filtered);
        }
    };

    const handleSelectItem = (item: Country | City) => {
        if (currentTab === "Cities" && !selectedCountryForCities) {
            // 나라 클릭 → 도시 로딩
            handleSelectCountryForCities(item as Country);
        } else {
            setSelectedItem(item);
        }
    };

    // 나라 클릭 시 해당 나라 도시 불러오기
    const handleSelectCountryForCities = async (country: Country) => {
        setSelectedCountryForCities(country);
        try {
            const module = await import(`../data/cities/${country.code}.ts`);
            // 동적 import된 모듈에서 도시 배열 가져오기
            setCityList(module[country.code]);
            setResults(module[country.code]);
            setQuery(""); // 검색어 초기화
        } catch (err) {
            console.error("City data import failed for", country.code, err);
            setCityList([]);
            setResults([]);
        }
    };

    const closeSelectedModal = () => setSelectedItem(null);

    const handleBeenClick = () => {
        if (!selectedItem) return;

        const countryCode =
            "code" in selectedItem
                ? selectedItem.code
                : selectedCountryForCities?.code; // 도시일 때 선택된 나라 코드

        if (!countryCode) return; // null 이슈 처리

        onUpdateVisited(countryCode, selectedItem);
        closeSelectedModal();
        setIsSearchPageOpen(true); // 검색 페이지 다시 열기
    };

    return (
        <>
            {/* 검색 버튼 */}
            <button
                onClick={() => setIsSearchPageOpen(true)}
                style={{
                    width: "100%",
                    height: "50%",
                    fontSize: "16px",
                    cursor: "pointer",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: "#2c2c30ff",
                    color: "#f2f2f7",
                    boxShadow: "inset 0 -1px 0 0 #ffffff1a",
                    WebkitAppearance: "none",
                    transition: "background 0.2s ease-in-out",
                }}
            >
                🔍 Search
            </button>

            {/* 전체 화면 검색 페이지 */}
            {isSearchPageOpen && (
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
                            width: "100%",
                            height: "100%",
                            backgroundColor: "white",
                            borderRadius: "0px",
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        {/* 상단 네비게이션 바 */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px 16px",
                                borderBottom: "1px solid #ffffff1a",
                            }}
                        >
                            {/* 뒤로가기 버튼 */}
                            <button
                                onClick={() => {
                                    if (currentTab === "Cities" && selectedCountryForCities) {
                                        // Cities 탭에서 도시 목록일 때 → 나라 목록으로 돌아가기
                                        setSelectedCountryForCities(null);
                                        setResults(countries);
                                        setQuery("");
                                    } else {
                                        // 검색 페이지 닫기
                                        setIsSearchPageOpen(false);
                                    }
                                }} style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                }}
                            >
                                ← Back
                            </button>

                            {/* 타이틀 */}
                            <span style={{ fontSize: "18px", fontWeight: "600" }}>
                                Select
                            </span>

                            {/* 오른쪽은 공간 확보용 (비워두기) */}
                            <div style={{ width: "50px" }} />
                        </div>


                        {/* 탭 */}
                        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                            <button
                                onClick={() => {
                                    setCurrentTab("Countries");
                                    setResults(countries);
                                    setQuery("");
                                    setSelectedCountryForCities(null); // 초기화

                                }}
                                style={{
                                    flex: 1,
                                    padding: "10px 16px",
                                    fontWeight: "500",
                                    borderRadius: "10px",
                                    border: "none",
                                    backgroundColor: currentTab === "Countries" ? "#007AFF" : "#f2f2f7",
                                    color: currentTab === "Countries" ? "white" : "#007AFF",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    transition: "all 0.2s ease-in-out",
                                }}
                            >
                                Countries
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentTab("Cities");
                                    setResults(countries); // Cities 탭 초기 화면은 나라 리스트
                                    setQuery("");
                                    setSelectedCountryForCities(null); // 초기화
                                }}
                                style={{
                                    flex: 1,
                                    padding: "10px 16px",
                                    fontWeight: "500",
                                    borderRadius: "10px",
                                    border: "none",
                                    backgroundColor: currentTab === "Cities" ? "#007AFF" : "#f2f2f7",
                                    color: currentTab === "Cities" ? "white" : "#007AFF",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    transition: "all 0.2s ease-in-out",
                                }}
                            >
                                Cities
                            </button>
                        </div>

                        {/* 검색창 */}
                        <input
                            type="text"
                            placeholder="Search for a country or city"
                            value={query}
                            onChange={handleChange}
                            style={{ padding: "8px", fontSize: "16px" }}
                        />

                        {/* 리스트 */}
                        {currentTab === "Cities" && selectedCountryForCities && (
                            <div
                                style={{
                                    padding: "8px",
                                    borderBottom: "1px solid #ddd",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    color: "#007AFF",
                                }}
                                onClick={() => {
                                    // 나라 목록으로 돌아가기
                                    setSelectedCountryForCities(null);
                                    setResults(countries);
                                    setQuery("");
                                }}
                            >
                                ← Back to country list
                            </div>
                        )}

                        <ul style={{ listStyle: "none", padding: 0, margin: 0, overflowY: "auto", flex: 1 }}>
                            {results.map((item, idx) => {
                                const name = item.name;
                                const search = query.trim().toLowerCase();

                                // 검색어가 있고, 이름에 포함되어 있는 경우
                                const startIdx = name.toLowerCase().indexOf(search);
                                const isCountryInCitiesTab = currentTab === "Cities" && !selectedCountryForCities;

                                const content = (
                                    <>
                                        {name.slice(0, startIdx)}
                                        {search && startIdx !== -1 && <span style={{ fontWeight: "bold" }}>{name.slice(startIdx, startIdx + search.length)}</span>}
                                        {name.slice(startIdx + (search && startIdx !== -1 ? search.length : 0))}
                                        {isCountryInCitiesTab && (
                                            <span style={{ fontWeight: "bold" }}>{">"}</span> // 변경: ">" 표시
                                        )}
                                    </>
                                );

                                // 검색어 없거나 불일치
                                return (
                                    <li
                                        key={idx}
                                        style={{
                                            padding: "8px",
                                            borderBottom: "1px solid #ddd",
                                            cursor: "pointer",
                                            display: "flex",
                                            justifyContent: "space-between", // 오른쪽 ">" 띄우기
                                            alignItems: "center",
                                        }}
                                        onClick={() => handleSelectItem(item)}
                                    >
                                        {content}
                                    </li>
                                );
                            })}
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
                        backgroundColor: "#1a1a1d1a",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1001,
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
                        <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>{selectedItem.name}</h2>
                        <button
                            onClick={handleBeenClick}
                            style={{
                                backgroundColor: "#007AFF",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                padding: "12px",
                                fontSize: "16px",
                                fontWeight: "500",
                                cursor: "pointer",
                                boxShadow: "0 2px 4px #1a1a1d1a",
                            }}
                        >
                            Been
                        </button>

                        <button
                            onClick={closeSelectedModal}
                            style={{
                                backgroundColor: "#f2f2f7",
                                color: "#007AFF",
                                border: "none",
                                borderRadius: "12px",
                                padding: "12px",
                                fontSize: "16px",
                                fontWeight: "500",
                                cursor: "pointer",
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
