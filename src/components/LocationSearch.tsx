
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

interface LocationSearchProps {
  onSearch: (query: string) => void;
  isHero?: boolean;
}

const LocationSearch = ({ onSearch, isHero = false }: LocationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex w-full max-w-xl ${isHero ? 'flex-col sm:flex-row' : ''}`}>
      <Input
        type="text"
        placeholder="Search cities, attractions, hotels..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`${isHero ? 'rounded-r-none sm:rounded-r-none h-12 text-base' : 'h-10'}`}
      />
      <Button 
        type="submit"
        className={`${isHero ? 'mt-2 sm:mt-0 h-12 sm:rounded-l-none' : 'rounded-l-none'}`}
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default LocationSearch;
