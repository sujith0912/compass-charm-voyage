
import { Location } from '@/types';
import LocationCard from './LocationCard';

interface LocationResultsProps {
  locations: Location[];
  onFavoriteChange?: () => void;
  searchQuery?: string;
}

const LocationResults = ({ locations, onFavoriteChange, searchQuery }: LocationResultsProps) => {
  if (locations.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-700">No results found for "{searchQuery}"</h3>
        <p className="text-gray-500 mt-2">Try searching for a different location or attraction.</p>
      </div>
    );
  }

  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {searchQuery ? `Results for "${searchQuery}"` : "Recommended Places"}
        </h2>
        <p className="text-gray-500">{locations.length} places found</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <LocationCard 
            key={location.id} 
            location={location}
            onFavoriteChange={onFavoriteChange}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationResults;
