import React, { useState } from "react";
import { countries } from "../data/countries.ts";
import { cities } from "../data/cities.ts";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            // 검색창 비우면 전체 리스트 보여주기
            setResults(currentTab === "Countries" ? countries : cities);
        } else {
            const filtered = (currentTab === "Countries" ? countries : cities).filter(item =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setResults(filtered);
        }
    };

    const handleSelectItem = (item: Country | City) => {
        setSelectedItem(item);
    };

    const closeSelectedModal = () => setSelectedItem(null);

    const handleBeenClick = () => {
        if (!selectedItem) return;

        onUpdateVisited(
            "code" in selectedItem ? selectedItem.code : selectedItem.countryCode,
            selectedItem
        );

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
                    height: "100%",
                    padding: "8px",
                    fontSize: "16px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f5f5f5",
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
                        {/* 닫기 버튼 */}
                        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "8px" }}>
                            <button
                                onClick={() => setIsSearchPageOpen(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    padding: 0,
                                    lineHeight: 1,
                                }}
                            >
                                X
                            </button>
                        </div>

                        {/* 탭 */}
                        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                            <button
                                onClick={() => {
                                    setCurrentTab("Countries");
                                    setResults(countries);
                                    setQuery("");
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
                                    setResults(cities);
                                    setQuery("");
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
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, overflowY: "auto", flex: 1 }}>
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
                                backgroundColor: "#007AFF", // iOS 파란색
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                padding: "12px",
                                fontSize: "16px",
                                fontWeight: "500",
                                cursor: "pointer",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                        >
                            Been
                        </button>

                        <button
                            onClick={closeSelectedModal}
                            style={{
                                backgroundColor: "#f2f2f7", // iOS 회색 배경
                                color: "#007AFF", // 파란 글씨
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
