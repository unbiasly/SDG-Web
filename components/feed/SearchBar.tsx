'use client';
import { History, Search } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

const SearchBar = ({ className = "" }: { className?: string }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchBarRef = useRef<HTMLDivElement>(null); // Create a ref for the search bar container

    const getRecentSearches = async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("Fetching recent searches...");
            const response = await fetch(`/api/search?recentSearch=true`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            // Check if the response is OK before parsing
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error response:", errorText);
                throw new Error(
                    `Failed to fetch recent searches: ${response.status}`
                );
            }
            const data = await response.json();
            // Check if data has the expected structure
            if (data.success && Array.isArray(data.data)) {
                setRecentSearches(data.data);
            } else {
                console.error("Unexpected data structure:", data);
                throw new Error("Invalid response format");
            }
            return data;
        } catch (err) {
            console.error("Error fetching recent searches:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to fetch recent searches"
            );
            setRecentSearches([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            const query = event.currentTarget.value;
            console.log("Search submitted:", query);

            if (query) {
                window.location.href = `/search/${query}`;
            }
        }
    };

    const focusSearch = () => {
        setIsFocused(true);
        getRecentSearches();
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        // Check if the related target (element receiving focus) is outside the searchBarRef
        if (
            searchBarRef.current &&
            !searchBarRef.current.contains(event.relatedTarget as Node | null)
        ) {
            setIsFocused(false);
        }
    };

    return (
        <div
            ref={searchBarRef} // Attach the ref here
            className={`relative rounded-2xl flex-1 w-full ${className}`}
        >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search"
                className="w-full h-10 pl-10 pr-4 rounded-2xl bg-sdg-gray text-sm outline-none ring-1 ring-gray-300 transition-all duration-200"
                onKeyDown={handleSearch}
                onFocus={focusSearch}
                onBlur={handleBlur} // Add the onBlur handler
            />

            {isFocused && (
                <div className=" absolute w-full mt-1 bg-white rounded-lg shadow-lg z-[1000] border border-gray-300 overflow-y-auto">
                    <div className="p-2">
                        <h4 className="text-xs font-medium text-gray-500 mb-2">
                            Recent Searches
                        </h4>
                        {isLoading ? (
                            <p className="text-sm text-gray-500 py-2 px-2">
                                Loading...
                            </p>
                        ) : recentSearches.length > 0 ? (
                            <div>
                                {recentSearches.map((search, index) => (
                                    <button
                                        key={index}
                                        className="w-full justify-start text-black text-sm text-left px-2 py-1.5 flex items-center bg-white hover:bg-gray-100 rounded-md cursor-pointer"
                                        onClick={() => {
                                            console.log(
                                                `Navigating to search: ${search}`
                                            );
                                            // The Link component will handle navigation.
                                            // Close the dropdown after selection.
                                            setIsFocused(false);
                                        }}
                                    >
                                        <Link
                                            href={`/search/${search}`}
                                            className="flex items-center w-full"
                                            prefetch={false} // Disable prefetching for performance
                                        >
                                            <History className="h-3.5 w-3.5 text-gray-400 mr-2" />
                                            {search}
                                        </Link>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 py-2 px-2">
                                No recent searches
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
