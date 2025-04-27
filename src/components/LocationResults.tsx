
import { Location, LocationGroup } from '@/types';
import LocationCard from './LocationCard';
import { Star, Sparkles, MapPin } from 'lucide-react';
import { useState } from 'react';
import { getGroupedLocations } from '@/services/api';

interface LocationResultsProps {
  locations: Location[];
  onFavoriteChange?: () => void;
  searchQuery?: string;
}

const LocationResults = ({ locations, onFavoriteChange, searchQuery }: LocationResultsProps) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const groupedLocations = getGroupedLocations(locations);
  
  const getTravelAssistantMessage = (query?: string) => {
    if (!query) return null;
    
    const messages = [
      `Hey traveler! 🌈 I found some amazing places in ${query} just for you!`,
      `Looking for adventure in ${query}? I've got you covered with these incredible spots! ✨`,
      `${query} is waiting for you! Check out these wonderful places I've found! 🌟`,
      `Planning a trip to ${query}? Here's everything you need to know! 🧳`,
      `Welcome to ${query}! 🌍 I've gathered all the best places to make your trip unforgettable!`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getTravelTips = (query?: string) => {
    if (!query) return null;
    
    const tips = [
      `Don't forget to try the local cuisine in ${query}! It's a must for any traveler. 🍲`,
      `The best time to visit attractions in ${query} is early morning to avoid crowds. ⏰`,
      `Looking for budget options? Many museums in ${query} offer free entry on certain days! 💰`,
      `Public transportation in ${query} is very efficient and can save you both time and money. 🚆`,
      `When visiting ${query}, consider getting a city pass for discounts on multiple attractions! 🎫`
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
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
          <p className="text-gray-500 mt-4 max-w-md">
            Maybe try a different spelling or a nearby city? I'd love to help you find the perfect spot for your adventure! 🧭
          </p>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return null;
  }

  const assistantMessage = getTravelAssistantMessage(searchQuery);
  const travelTip = getTravelTips(searchQuery);

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

      {assistantMessage && (
        <div className="bg-gradient-to-r from-tourism-teal/10 to-tourism-blue/10 p-4 rounded-lg mb-6 animate-fade-in">
          <p className="text-lg font-medium">{assistantMessage}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex space-x-2 border-b overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-t-lg font-medium transition ${
              activeTab === 'all' ? 'bg-tourism-teal/10 border-b-2 border-tourism-teal' : 'hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {groupedLocations.map((group, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(group.title)}
              className={`px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition flex items-center ${
                activeTab === group.title ? 'bg-tourism-teal/10 border-b-2 border-tourism-teal' : 'hover:bg-gray-100'
              }`}
            >
              <span className="mr-1">{group.emoji}</span> {group.title}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-12">
        {(activeTab === 'all' ? groupedLocations : groupedLocations.filter(group => group.title === activeTab)).map((group, index) => (
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

      {travelTip && searchQuery && (
        <div className="mt-8 p-4 bg-tourism-teal/10 rounded-lg text-gray-700">
          <p className="text-sm italic">
            <span className="font-medium">Travel Tip:</span> {travelTip}
          </p>
        </div>
      )}

      <div className="mt-8 p-4 bg-tourism-teal/10 rounded-lg text-gray-700">
        <p className="text-sm italic">
          "Hey traveler! 🌟 These are the best spots I found for you! Each place has been carefully chosen to make your trip unforgettable. Don't forget to save your favorites, and let me know if you need more suggestions! ✨"
        </p>
      </div>
    </div>
  );
};

export default LocationResults;
