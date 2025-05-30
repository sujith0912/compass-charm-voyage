
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LocationSearch from '@/components/LocationSearch';
import FeaturedLocations from '@/components/FeaturedLocations';
import LocationResults from '@/components/LocationResults';
import WeatherInfo from '@/components/WeatherInfo';
import Footer from '@/components/Footer';
import { Location, Weather } from '@/types';
import { searchLocations, getWeatherByCity, getFavoriteLocations, getLocationsByCity, getWeatherByPlace } from '@/services/api';
import { geocodePlace } from '@/services/openTripMapService';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MAX_RECENT_SEARCHES = 5;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [currentCity, setCurrentCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Location[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { toast } = useToast();

  // Load favorites and recent searches on component mount
  useEffect(() => {
    if (showFavorites) {
      loadFavorites();
    }
    
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, [showFavorites]);

  const loadFavorites = () => {
    const favs = getFavoriteLocations();
    setFavorites(favs);
    if (favs.length > 0) {
      setSearchQuery('Favorites');
    }
  };

  const addRecentSearch = (query: string) => {
    setRecentSearches(prev => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter(item => item !== query);
      
      // Add to beginning of array and limit to max items
      const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      
      // Save to localStorage
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      return updated;
    });
  };

  const clearRecentSearch = (query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(item => item !== query);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearch = async (query: string) => {
    setShowFavorites(false);
    setLoading(true);
    setSearchQuery(query);
    addRecentSearch(query);
    
    try {
      // First, try to geocode to get the proper city name
      const geocoded = await geocodePlace(query);
      let cityName = query;
      
      if (geocoded) {
        // Extract city name from display name (format: "City, State, Country")
        const parts = geocoded.displayName.split(',');
        cityName = parts[0].trim();
        setCurrentCity(cityName);
        
        // Get weather for this location
        const weatherData = await getWeatherByPlace(cityName);
        setWeather(weatherData);
      }
      
      // Search for locations
      const results = await searchLocations(query);
      setLocations(results);
      
      if (results.length > 0) {
        toast({
          title: "Places found!",
          description: `Found ${results.length} amazing places in ${cityName}`,
        });
      } else {
        // If no results, try to get weather anyway if we haven't already
        if (!geocoded) {
          const weatherData = await getWeatherByCity(query);
          setWeather(weatherData);
          setCurrentCity(query);
        }
        
        toast({
          title: "Limited results found",
          description: `We found limited information for ${query}. Try another nearby city or popular destination.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search error",
        description: "Something went wrong while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = async (city: string) => {
    setShowFavorites(false);
    setLoading(true);
    setSearchQuery(city);
    setCurrentCity(city);
    addRecentSearch(city);
    
    try {
      // Get locations for this city
      const cityLocations = await getLocationsByCity(city);
      setLocations(cityLocations);
      
      // Get weather for this city
      const weatherData = await getWeatherByCity(city);
      setWeather(weatherData);
      
      toast({
        title: `Welcome to ${city}!`,
        description: `Discovered ${cityLocations.length} places for your journey`,
      });
    } catch (error) {
      console.error('City select error:', error);
      toast({
        title: "Error loading city",
        description: `We had trouble loading information for ${city}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    loadFavorites();
  };

  const handleTryCurrentLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Locating you",
        description: "Please allow location access to continue",
      });
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLoading(true);
            
            // Get the coordinates
            const { latitude, longitude } = position.coords;
            
            // Do reverse geocoding to get the location name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            
            // Extract city name
            const locationName = data.address?.city || 
                               data.address?.town || 
                               data.address?.village || 
                               "Your Current Location";
            
            setSearchQuery(locationName);
            setCurrentCity(locationName);
            addRecentSearch(locationName);
            
            // Get weather and locations
            const weatherData = await getWeatherByPlace(locationName);
            setWeather(weatherData);
            
            // Search for locations near these coordinates
            const results = await searchLocations(locationName);
            setLocations(results);
            
            toast({
              title: "Location found!",
              description: `Showing places near ${locationName}`,
            });
          } catch (error) {
            console.error('Geolocation error:', error);
            toast({
              title: "Location error",
              description: "We couldn't determine your location. Try searching instead.",
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location access denied",
            description: "Please enable location services or search manually",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
    }
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
          <LocationSearch 
            onSearch={handleSearch} 
            isHero={true} 
            recentSearches={recentSearches}
            onClearRecentSearch={clearRecentSearch}
            isSearching={loading}
          />
          
          {/* Location options */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTryCurrentLocation}
              className="bg-white/20 hover:bg-white/40 text-white"
              disabled={loading}
            >
              <MapPin className="h-3.5 w-3.5 mr-1" /> Use my location
            </Button>
            
            {/* Quick city chips */}
            <div className="flex flex-wrap justify-center gap-2">
              {['Paris', 'New York', 'Tokyo', 'Rome', 'Sydney'].map(city => (
                <Button 
                  key={city}
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCitySelect(city)}
                  className="bg-white/20 hover:bg-white/40 text-white"
                  disabled={loading}
                >
                  <MapPin className="h-3.5 w-3.5 mr-1" /> {city}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex-grow">
        {loading ? (
          <div className="container mx-auto py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-tourism-teal" />
              <p className="text-gray-600">Finding amazing places for you...</p>
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
            {!showFavorites && !loading && searchQuery && (
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
