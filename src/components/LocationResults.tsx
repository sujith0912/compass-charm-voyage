
import { Location } from '@/types';
import LocationCard from './LocationCard';
import { Star, Sparkles } from 'lucide-react';

interface LocationResultsProps {
  locations: Location[];
  onFavoriteChange?: () => void;
  searchQuery?: string;
}

const LocationResults = ({ locations, onFavoriteChange, searchQuery }: LocationResultsProps) => {
  const groupLocations = (locations: Location[]) => {
    const groups = {
      attraction: {
        title: "Must-Visit Attractions",
        emoji: "🌟",
        description: "Incredible sights you can't miss!",
        locations: [] as Location[]
      },
      hotel: {
        title: "Cozy Places to Stay",
        emoji: "🏨",
        description: "Perfect spots to rest after your adventures",
        locations: [] as Location[]
      },
      restaurant: {
        title: "Delightful Dining Spots",
        emoji: "🍽️",
        description: "Local flavors and culinary experiences",
        locations: [] as Location[]
      }
    };

    locations.forEach(location => {
      if (location.type in groups) {
        groups[location.type as keyof typeof groups].locations.push(location);
      }
    });

    return Object.values(groups).filter(group => group.locations.length > 0);
  };

  if (locations.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Sparkles className="h-12 w-12 text-tourism-teal opacity-50" />
          <h3 className="text-xl font-medium text-gray-700">
            Oops! No results found for "{searchQuery}" 🌍
          </h3>
          <p className="text-gray-500 mt-2">
            Don't worry, traveler! Try searching for a different location or check out our featured destinations! ✨
          </p>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return null;
  }

  const groupedLocations = groupLocations(locations);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {searchQuery ? (
            <>
              <span>Discovering {searchQuery} ✨</span>
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            </>
          ) : (
            "Recommended Places"
          )}
        </h2>
        <p className="text-gray-500">{locations.length} amazing places found</p>
      </div>

      <div className="space-y-12">
        {groupedLocations.map((group, index) => (
          <div key={index} className="space-y-6">
            <div className="border-b pb-2">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span>{group.emoji}</span>
                {group.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{group.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.locations.map((location) => (
                <LocationCard 
                  key={location.id} 
                  location={location}
                  onFavoriteChange={onFavoriteChange}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-tourism-teal/10 rounded-lg text-gray-700">
        <p className="text-sm italic">
          "Hey traveler! 🌟 These are the best spots I found for you! Each place has been carefully chosen to make your trip unforgettable. Don't forget to save your favorites, and let me know if you need more suggestions! ✨"
        </p>
      </div>
    </div>
  );
};

export default LocationResults;

