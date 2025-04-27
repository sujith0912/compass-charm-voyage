
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';
import LocationSearch from './LocationSearch';

interface HeaderProps {
  onShowFavorites: () => void;
}

const Header = ({ onShowFavorites }: HeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
  
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-tourism-blue flex items-center">
            <span className="text-tourism-teal">Compass</span>Charm
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onShowFavorites}
            className="flex items-center text-sm"
          >
            <Heart className="h-4 w-4 mr-1" />
            Favorites
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
