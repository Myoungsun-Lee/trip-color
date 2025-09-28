import React, { useState } from "react";
import { countries } from "../data/countries.ts";
import styles from "./SearchBar.module.css";


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
            <button onClick={() => setIsSearchPageOpen(true)} className={styles.searchButton}>
                🔍 Search
            </button>


            {/* 검색 페이지 */}
            {isSearchPageOpen && (
                <div className={styles.searchOverlay}>
                    <div className={styles.searchContainer}>
                        {/* 상단 네비게이션 바 */}
                        <div className={styles.searchNavbar}>
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
                                }}
                                className={styles.searchBack}
                            >
                                ← Back
                            </button>

                            {/* 타이틀 */}
                            <span style={{ fontSize: "18px", fontWeight: "600" }}>
                                Select
                            </span>

                            {/* 오른쪽 공간 확보용 */}
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
                                className={`${styles.tabButton} ${currentTab === "Countries" ? styles.tabActive : styles.tabInactive}`}
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
                                className={`${styles.tabButton} ${currentTab === "Cities" ? styles.tabActive : styles.tabInactive}`}
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
                                className={styles.searchList}
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
                                    </>
                                );

                                // 검색어 없거나 불일치
                                return (
                                    <li
                                        key={idx}
                                        className={styles.searchListNoItem}
                                        onClick={() => handleSelectItem(item)}
                                    >
                                        <span style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                            <span>{content}</span>
                                            {isCountryInCitiesTab && <span>{">"}</span>}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}

            {/* 선택 모달 */}
            {selectedItem && (
                <div className={styles.selectedOverlay}>
                    <div className={styles.selectedContainer}>
                        <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>{selectedItem.name}</h2>
                        <button onClick={handleBeenClick} className={styles.beenButton}>
                            Been
                        </button>

                        <button onClick={handleBeenClick} className={styles.closeButton}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
