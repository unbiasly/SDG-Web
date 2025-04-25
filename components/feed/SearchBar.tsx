import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecentSearches = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching recent searches...");
      const response = await fetch('/api/search?recentSearch=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Check if the response is OK before parsing
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to fetch recent searches: ${response.status}`);
      }
      
      const data = await response.json();
    //   console.log("Recent searches data:", data);
      
      // Check if data has the expected structure
      if (data.success && Array.isArray(data.data)) {
        setRecentSearches(data.data);
      } else {
        console.error('Unexpected data structure:', data);
        throw new Error('Invalid response format');
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching recent searches:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recent searches');
      setRecentSearches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentSearch = (search: string) => {
    
    // You could set the input value here
    window.location.href = `/search/${search}`
  };

  const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>)  => {
    if (event.key === 'Enter') {
      const query = event.currentTarget.value;
      // Handle search submission
        console.log("Search submitted:", query);

        if (query) {
            window.location.href = `/search/${query}`;
    }
  }
}

  const focusSearch = () => {
    setIsFocused(true);
    getRecentSearches();
  }

  return (
    <div className="relative rounded-2xl flex-1 w-full">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search"
        className="w-full h-10 pl-10 pr-4 rounded-2xl bg-sdg-gray text-sm outline-none ring-1 ring-gray-300 transition-all duration-200"
        onKeyDown={handleSearch}
        onFocus={focusSearch}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />
      
      {isFocused && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg z-10 border border-gray-200 max-h-60 overflow-y-auto">
          <div className="p-2">
            <h4 className="text-xs font-medium text-gray-500 mb-2">Recent Searches</h4>
            {isLoading ? (
              <p className="text-sm text-gray-500 py-2 px-2">Loading...</p>
            ) : error ? (
              <p className="text-sm text-red-500 py-2 px-2">Error: {error}</p>
            ) : recentSearches.length > 0 ? (
              <ul>
                {recentSearches.map((search, index) => (
                  <li 
                    key={index}
                    className="px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer text-sm flex items-center"
                    onClick={() => handleRecentSearch(search)}
                  >
                    <Search className="h-3.5 w-3.5 text-gray-400 mr-2" />
                    {search}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 py-2 px-2">No recent searches</p>
            )}
          </div>
        </div>
      )}
    </div> 
  )
}

export default SearchBar