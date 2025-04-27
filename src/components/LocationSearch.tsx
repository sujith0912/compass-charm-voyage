
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, X } from 'lucide-react';

interface LocationSearchProps {
  onSearch: (query: string) => void;
  isHero?: boolean;
  recentSearches?: string[];
  onClearRecentSearch?: (search: string) => void;
}

const LocationSearch = ({ 
  onSearch, 
  isHero = false,
  recentSearches = [],
  onClearRecentSearch
}: LocationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setIsFocused(false);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchTerm(search);
    onSearch(search);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-xl">
      <form 
        onSubmit={handleSubmit} 
        className={`flex w-full ${isHero ? 'flex-col sm:flex-row' : ''}`}
      >
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search cities, attractions, hotels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={`${isHero ? 'rounded-r-none sm:rounded-r-none h-12 text-base pl-10' : 'h-10 pl-10'}`}
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchTerm && (
            <button 
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button 
          type="submit"
          className={`${isHero ? 'mt-2 sm:mt-0 h-12 sm:rounded-l-none' : 'rounded-l-none'}`}
        >
          <Search className="h-4 w-4 mr-2" />
          Discover
        </Button>
      </form>

      {isFocused && recentSearches && recentSearches.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            <p className="text-xs text-gray-500 mb-2">Recent searches:</p>
            {recentSearches.map((search, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => handleRecentSearchClick(search)}
              >
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2 text-gray-400" />
                  <span>{search}</span>
                </div>
                {onClearRecentSearch && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearRecentSearch(search);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
