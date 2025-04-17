import { get } from 'http';
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
  // Sample recent searches - in a real app, these would come from storage/API
//   const recentSearches = [
//     "climate change", 
//     "renewable energy", 
//     "sustainable development",
//     "global warming"
//   ];

  const getRecentSearches = async () => {

    const response = await fetch('/api/search/recentSearch=true',
        {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        }
    );
    const data = await response.json();
    setRecentSearches(data.data);
    return data;
  }
  

  const handleRecentSearch = (search: string) => {
    // Logic to handle when a recent search is clicked
    console.log("Selected search:", search);
    // You could set the input value here
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const query = event.currentTarget.value;
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
            
            onFocus={focusSearch}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicking on recent searches
        />
        
        {isFocused && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg z-10 border border-gray-200 max-h-60 overflow-y-auto">
            <div className="p-2">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Recent Searches</h4>
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
            </div>
          </div>
        )}
    </div> 
  )
}

export default SearchBar