import { Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface JobSearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    debounceMs?: number;
}

const JobSearch = ({ 
    onSearch, 
    placeholder = "Search jobs...", 
    debounceMs = 500 
}: JobSearchProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search function
    const debouncedSearch = useCallback(
        (query: string) => {
            const timer = setTimeout(() => {
                onSearch(query);
                setIsSearching(false);
            }, debounceMs);

            return () => clearTimeout(timer);
        },
        [onSearch, debounceMs]
    );

    // Effect to handle search with debouncing
    useEffect(() => {
        if (searchQuery.trim()) {
            setIsSearching(true);
        }
        
        const cleanup = debouncedSearch(searchQuery.trim());
        return cleanup;
    }, [searchQuery, debouncedSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery("");
        onSearch("");
        setIsSearching(false);
    };

    return (
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 bg-gray-100 rounded-full border-none focus:ring-1 focus:ring-accent focus:outline-none text-sm"
            />
            
            {/* Clear button or loading indicator */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isSearching ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobSearch;
