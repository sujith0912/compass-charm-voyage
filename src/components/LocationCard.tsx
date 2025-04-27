
import { Location } from '@/types';
import { Button } from "@/components/ui/button";
import { Heart, Star, MapPin, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isLocationFavorite, addFavoriteLocation, removeFavoriteLocation } from '@/services/api';

interface LocationCardProps {
  location: Location;
  onFavoriteChange?: () => void;
}

const LocationCard = ({ location, onFavoriteChange }: LocationCardProps) => {
  const [favorite, setFavorite] = useState(false);
  
  useEffect(() => {
    setFavorite(isLocationFavorite(location.id));
  }, [location.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (favorite) {
      removeFavoriteLocation(location.id);
    } else {
      addFavoriteLocation(location);
    }
    
    setFavorite(!favorite);
    if (onFavoriteChange) {
      onFavoriteChange();
    }
  };

  const renderTypeTag = () => {
    switch (location.type) {
      case 'attraction':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">Attraction</span>;
      case 'restaurant':
        return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded">Restaurant</span>;
      case 'hotel':
        return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded">Hotel</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden location-card h-full flex flex-col transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48">
        <img
          src={location.imageUrl}
          alt={location.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // If image fails to load, replace with a backup image
            (e.target as HTMLImageElement).src = `https://source.unsplash.com/400x300/?${encodeURIComponent(location.type)},${encodeURIComponent(location.name)}`;
          }}
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md"
        >
          <Heart
            className={`h-4 w-4 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
          />
        </button>
        <div className="absolute bottom-2 left-2 flex items-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-xs font-medium text-gray-800">{location.rating.toFixed(1)}</span>
        </div>
        
        {location.source && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-white/80 backdrop-blur-sm text-xs px-2 py-1 rounded-md flex items-center">
              <Globe className="h-3 w-3 mr-1 text-gray-600" />
              <span className="text-gray-700">{location.source}</span>
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-2">{location.name}</h3>
          {location.priceLevel && (
            <span className="text-sm text-gray-500">{location.priceLevel}</span>
          )}
        </div>
        
        <div className="mb-2 flex flex-wrap gap-1 items-center">
          {renderTypeTag()}
          
          {location.highlights && location.highlights.map((highlight, i) => (
            <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
              {highlight}
            </span>
          ))}
        </div>
        
        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">{location.description}</p>
        
        {location.amenities && location.amenities.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Amenities:</p>
            <div className="flex flex-wrap gap-1">
              {location.amenities.map((amenity, i) => (
                <span key={i} className="bg-tourism-teal/10 text-tourism-teal text-xs px-2 py-0.5 rounded">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{location.address}</span>
        </div>
        
        <Button variant="outline" className="w-full mt-auto">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default LocationCard;
