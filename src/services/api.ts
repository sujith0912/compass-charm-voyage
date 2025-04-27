import { Location, Weather, City, GeocodeResult } from '../types';
import { searchLocationsByPlace, geocodePlace } from './openTripMapService';
import { getWeatherByCity as getWeatherByCityFromService, getWeatherByCoordinates } from './weatherService';

// Mock data is kept for fallback and featured cities
const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'Eiffel Tower',
    type: 'attraction',
    description: 'Iconic iron tower that defines the Paris skyline. Enjoy breathtaking views of the city from its observation decks.',
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&q=80&w=2501&ixlib=rb-4.0.3',
    priceLevel: '$$'
  },
  {
    id: '2',
    name: 'Santorini Island',
    type: 'attraction',
    description: 'Famous for its stunning sunsets, white-washed buildings, and blue domes overlooking the Aegean Sea.',
    address: 'Santorini, Greece',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2574&ixlib=rb-4.0.3',
    priceLevel: '$$$'
  },
  {
    id: '3',
    name: 'The Ritz Paris',
    type: 'hotel',
    description: 'Luxurious 5-star hotel offering elegant accommodation, a spa, and fine dining in the heart of Paris.',
    address: '15 Place Vendôme, 75001 Paris, France',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=2370&ixlib=rb-4.0.3',
    priceLevel: '$$$$'
  },
  {
    id: '4',
    name: 'Le Jules Verne',
    type: 'restaurant',
    description: 'Upscale dining experience located on the second floor of the Eiffel Tower offering panoramic views of Paris.',
    address: 'Eiffel Tower, Avenue Gustave Eiffel, 75007 Paris, France',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=2370&ixlib=rb-4.0.3',
    priceLevel: '$$$$'
  },
  {
    id: '5',
    name: 'Machu Picchu',
    type: 'attraction',
    description: 'Ancient Incan citadel set high in the Andes Mountains, featuring remarkable stone structures and breathtaking views.',
    address: 'Machu Picchu, Peru',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=2370&ixlib=rb-4.0.3',
    priceLevel: '$$'
  },
  {
    id: '6',
    name: 'Amalfi Coast',
    type: 'attraction',
    description: 'Stunning stretch of coastline known for its dramatic cliffs, colorful villages, and scenic beaches.',
    address: 'Amalfi Coast, Italy',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1612698093158-e07ac200d44e?auto=format&fit=crop&q=80&w=2370&ixlib=rb-4.0.3',
    priceLevel: '$$'
  }
];

// Keep basic weather data for fallback
const MOCK_WEATHER: Record<string, Weather> = {
  'Paris': {
    temperature: 18,
    condition: 'Partly Cloudy',
    icon: 'cloud-sun',
    humidity: 65,
    windSpeed: 10
  },
  'Santorini': {
    temperature: 25,
    condition: 'Sunny',
    icon: 'sun',
    humidity: 55,
    windSpeed: 8
  },
  'New York': {
    temperature: 15,
    condition: 'Rainy',
    icon: 'cloud-rain',
    humidity: 80,
    windSpeed: 15
  }
};

const FEATURED_CITIES: City[] = [
  {
    name: 'Paris',
    country: 'France',
    description: 'The City of Light beckons with its iconic landmarks and charming atmosphere.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=2373&ixlib=rb-4.0.3'
  },
  {
    name: 'Santorini',
    country: 'Greece',
    description: 'Stunning island with white-washed buildings and breathtaking sunsets.',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2574&ixlib=rb-4.0.3'
  },
  {
    name: 'New York',
    country: 'USA',
    description: 'The Big Apple offers world-class entertainment, dining, and iconic skylines.',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=2370&ixlib=rb-4.0.3'
  }
];

// Updated API functions
export const searchLocations = async (query: string): Promise<Location[]> => {
  console.log(`Searching for locations matching: ${query}`);
  
  try {
    // First try to fetch from real API
    const locations = await searchLocationsByPlace(query);
    
    // If we got results, return them
    if (locations && locations.length > 0) {
      return locations;
    }
    
    // If API search fails, fall back to mock data
    console.log('Falling back to mock data search');
    return MOCK_LOCATIONS.filter(
      location => location.name.toLowerCase().includes(query.toLowerCase()) ||
                location.description.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error in searchLocations:', error);
    
    // Return mock data as fallback
    return MOCK_LOCATIONS.filter(
      location => location.name.toLowerCase().includes(query.toLowerCase()) ||
                location.description.toLowerCase().includes(query.toLowerCase())
    );
  }
};

export const getWeatherByPlace = async (place: string): Promise<Weather | null> => {
  console.log(`Getting weather for place: ${place}`);
  
  try {
    // Try to get weather from real API
    const weather = await getWeatherByCityFromService(place);
    
    if (weather) {
      return weather;
    }
    
    // If that fails, try to geocode the place and get weather by coordinates
    const geocoded = await geocodePlace(place);
    if (geocoded) {
      return await getWeatherByCoordinates(geocoded.lat, geocoded.lon);
    }
    
    // Fallback to mock data
    console.log('Falling back to mock weather data');
    const normalizedPlace = place.split(',')[0].trim();
    const weatherKey = Object.keys(MOCK_WEATHER).find(
      key => key.toLowerCase() === normalizedPlace.toLowerCase()
    );
    
    return weatherKey ? MOCK_WEATHER[weatherKey] : null;
  } catch (error) {
    console.error('Error in getWeatherByPlace:', error);
    
    // Fallback to mock data
    const normalizedPlace = place.split(',')[0].trim();
    const weatherKey = Object.keys(MOCK_WEATHER).find(
      key => key.toLowerCase() === normalizedPlace.toLowerCase()
    );
    
    return weatherKey ? MOCK_WEATHER[weatherKey] : null;
  }
};

export const getWeatherByCity = async (city: string): Promise<Weather | null> => {
  return getWeatherByPlace(city);
};

export const getFeaturedCities = async (): Promise<City[]> => {
  console.log('Getting featured cities');
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(FEATURED_CITIES);
    }, 300);
  });
};

export const getLocationsByCity = async (city: string): Promise<Location[]> => {
  console.log(`Getting locations for city: ${city}`);
  return searchLocations(city);
};

// Favorites management (using local storage)
export const getFavoriteLocations = (): Location[] => {
  const favorites = localStorage.getItem('favoriteLocations');
  return favorites ? JSON.parse(favorites) : [];
};

export const addFavoriteLocation = (location: Location): void => {
  const favorites = getFavoriteLocations();
  if (!favorites.some(fav => fav.id === location.id)) {
    favorites.push(location);
    localStorage.setItem('favoriteLocations', JSON.stringify(favorites));
  }
};

export const removeFavoriteLocation = (locationId: string): void => {
  const favorites = getFavoriteLocations();
  const updatedFavorites = favorites.filter(fav => fav.id !== locationId);
  localStorage.setItem('favoriteLocations', JSON.stringify(updatedFavorites));
};

export const isLocationFavorite = (locationId: string): boolean => {
  const favorites = getFavoriteLocations();
  return favorites.some(fav => fav.id === locationId);
};
