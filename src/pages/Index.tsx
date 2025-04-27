
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LocationSearch from '@/components/LocationSearch';
import FeaturedLocations from '@/components/FeaturedLocations';
import LocationResults from '@/components/LocationResults';
import WeatherInfo from '@/components/WeatherInfo';
import Footer from '@/components/Footer';
import { Location, Weather } from '@/types';
import { searchLocations, getWeatherByCity, getFavoriteLocations, getLocationsByCity } from '@/services/api';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [currentCity, setCurrentCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Location[]>([]);

  // Load favorites on component mount
  useEffect(() => {
    if (showFavorites) {
      loadFavorites();
    }
  }, [showFavorites]);

  const loadFavorites = () => {
    const favs = getFavoriteLocations();
    setFavorites(favs);
    if (favs.length > 0) {
      setSearchQuery('Favorites');
    }
  };

  const handleSearch = async (query: string) => {
    setShowFavorites(false);
    setLoading(true);
    setSearchQuery(query);
    try {
      const results = await searchLocations(query);
      setLocations(results);
      
      if (results.length > 0) {
        // Extract city from first result's address for weather info
        const cityMatch = results[0].address.split(',')[0].trim();
        setCurrentCity(cityMatch);
        
        // Get weather for the city
        const weatherData = await getWeatherByCity(cityMatch);
        setWeather(weatherData);
      } else {
        setWeather(null);
        setCurrentCity('');
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = async (city: string) => {
    setShowFavorites(false);
    setLoading(true);
    setSearchQuery(city);
    setCurrentCity(city);
    try {
      // Get locations for this city
      const cityLocations = await getLocationsByCity(city);
      setLocations(cityLocations);
      
      // Get weather for this city
      const weatherData = await getWeatherByCity(city);
      setWeather(weatherData);
    } catch (error) {
      console.error('City select error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    loadFavorites();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onShowFavorites={handleShowFavorites} />
      
      {/* Hero section with search */}
      <div className="bg-hero-pattern bg-cover bg-center h-[400px] flex items-center justify-center px-4">
        <div className="hero-search-container p-6 rounded-xl max-w-2xl w-full text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Discover Your Next Adventure
          </h1>
          <p className="text-white/80 mb-6">
            Explore attractions, restaurants, and hotels around the world
          </p>
          <LocationSearch onSearch={handleSearch} isHero={true} />
          
          {/* Quick city chips */}
          <div className="flex flex-wrap justify-center mt-4 gap-2">
            {['Paris', 'New York', 'Tokyo', 'Rome'].map(city => (
              <Button 
                key={city}
                variant="outline" 
                size="sm"
                onClick={() => handleCitySelect(city)}
                className="bg-white/20 hover:bg-white/40 text-white"
              >
                <MapPin className="h-3.5 w-3.5 mr-1" /> {city}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex-grow">
        {loading ? (
          <div className="container mx-auto py-12 text-center">
            <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4 mx-auto mb-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Display weather if available */}
            {weather && currentCity && (
              <div className="container mx-auto mt-8">
                <WeatherInfo weather={weather} city={currentCity} />
              </div>
            )}
            
            {/* Display search results or favorites */}
            {showFavorites ? (
              <LocationResults 
                locations={favorites} 
                onFavoriteChange={loadFavorites} 
                searchQuery="Favorites" 
              />
            ) : searchQuery ? (
              <LocationResults 
                locations={locations} 
                onFavoriteChange={() => {}} 
                searchQuery={searchQuery} 
              />
            ) : (
              <FeaturedLocations onSelectCity={handleCitySelect} />
            )}
            
            {/* AI Travel Tips Section */}
            {!showFavorites && !loading && (
              <div className="container mx-auto py-8">
                <div className="bg-gradient-to-r from-tourism-teal/10 to-tourism-blue/10 rounded-xl p-6 md:p-8">
                  <h2 className="text-2xl font-semibold mb-4">Travel Tips</h2>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <p className="text-gray-700 italic">
                      "Hey traveler! 🌟 Did you know that spring (April-June) is the best time to visit Paris? 
                      You'll avoid the summer crowds while enjoying pleasant weather and blooming gardens. 
                      Don't miss the sunset view from Montmartre - it's absolutely magical! ✨"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
