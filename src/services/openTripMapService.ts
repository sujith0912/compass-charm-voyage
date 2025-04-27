
import { 
  OpenTripMapPlace, 
  OpenTripMapPlaceDetail, 
  GeocodeResult, 
  Location 
} from '@/types';

// This is a demo API key for OpenTripMap, should be replaced with a proper key in production
const API_KEY = '5ae2e3f221c38a28845f05b61e0fdcddc7d1990617f7a217302689be';
const BASE_URL = 'https://api.opentripmap.com/0.1/en';

// Helper function to determine the type based on kinds
const determineLocationType = (kinds: string): 'attraction' | 'hotel' | 'restaurant' => {
  if (kinds.includes('accomodations') || kinds.includes('hotels')) {
    return 'hotel';
  } else if (kinds.includes('foods') || kinds.includes('restaurants')) {
    return 'restaurant';
  } else {
    return 'attraction';
  }
};

// Helper to get emoji based on type
const getKindEmoji = (kind: string): string => {
  if (kind.includes('museums')) return '🏛️';
  if (kind.includes('historic')) return '🏰';
  if (kind.includes('natural')) return '🏞️';
  if (kind.includes('cultural')) return '🎭';
  if (kind.includes('amusement')) return '🎢';
  if (kind.includes('sport')) return '🏆';
  if (kind.includes('beaches')) return '🏖️';
  if (kind.includes('gardens')) return '🌷';
  if (kind.includes('religion')) return '⛪';
  if (kind.includes('architecture')) return '🏛️';
  if (kind.includes('accomodations')) return '🏨';
  if (kind.includes('foods')) return '🍽️';
  return '🌟';
};

// Geocoding a place name to coordinates
export const geocodePlace = async (placeName: string): Promise<GeocodeResult | null> => {
  try {
    console.log(`Geocoding place: ${placeName}`);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`);
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name,
        country: data[0].address?.country || ''
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding place:', error);
    return null;
  }
};

// Get places around a location
export const getPlacesNearby = async (
  lat: number, 
  lon: number, 
  radius: number = 5000, 
  limit: number = 50
): Promise<OpenTripMapPlace[]> => {
  try {
    console.log(`Getting places near ${lat}, ${lon} with radius ${radius}m`);
    const response = await fetch(
      `${BASE_URL}/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=${limit}&apikey=${API_KEY}`
    );
    const data = await response.json();
    return data.features ? data.features.map((f: any) => ({
      xid: f.properties.xid,
      name: f.properties.name,
      kinds: f.properties.kinds,
      point: f.geometry.coordinates ? {
        lon: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1]
      } : undefined,
      rate: f.properties.rate,
      dist: f.properties.dist
    })) : [];
  } catch (error) {
    console.error('Error getting places nearby:', error);
    return [];
  }
};

// Get place details
export const getPlaceDetails = async (xid: string): Promise<OpenTripMapPlaceDetail | null> => {
  try {
    console.log(`Getting details for place: ${xid}`);
    const response = await fetch(`${BASE_URL}/places/xid/${xid}?apikey=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error(`Error getting place details for ${xid}:`, error);
    return null;
  }
};

// Convert OpenTripMap place to our Location format
export const convertToLocation = async (place: OpenTripMapPlace): Promise<Location | null> => {
  try {
    const details = await getPlaceDetails(place.xid);
    
    if (!details || !details.name) {
      return null;
    }

    const type = determineLocationType(place.kinds);
    const description = details.wikipedia_extracts?.text || 
                       details.info?.descr || 
                       `A ${type} in the area worth checking out`;
    
    // Format the address
    const address = details.address ? 
      Object.values(details.address).filter(Boolean).join(', ') : 
      'Address not available';
      
    // Get image URL or use placeholder
    const imageUrl = details.preview?.source || 
                    details.image || 
                    `https://source.unsplash.com/400x300/?${encodeURIComponent(type)},${encodeURIComponent(details.name)}`;
    
    return {
      id: place.xid,
      name: details.name,
      type,
      description: description.substring(0, 300) + (description.length > 300 ? '...' : ''),
      address,
      rating: details.rate ? parseFloat(details.rate) : Math.random() * 2 + 3, // Generate a rating between 3-5 if not available
      imageUrl,
      category: place.kinds.split(',')[0],
      coordinates: {
        lat: place.point.lat,
        lon: place.point.lon
      },
      source: 'OpenTripMap',
      highlights: place.kinds.split(',').map(kind => kind.trim()).slice(0, 3)
    };
  } catch (error) {
    console.error(`Error converting place ${place.xid} to location:`, error);
    return null;
  }
};

// Main function to search locations
export const searchLocationsByPlace = async (placeName: string): Promise<Location[]> => {
  try {
    console.log(`Searching locations for place: ${placeName}`);
    
    // First, geocode the place name to get coordinates
    const geocoded = await geocodePlace(placeName);
    if (!geocoded) {
      console.error(`Could not geocode location: ${placeName}`);
      return [];
    }
    
    // Get places around the coordinates
    const places = await getPlacesNearby(geocoded.lat, geocoded.lon);
    console.log(`Found ${places.length} places near ${placeName}`);
    
    // Convert each place to our Location format
    const locationPromises = places.filter(place => place.name).map(place => convertToLocation(place));
    const locations = await Promise.all(locationPromises);
    
    // Filter out null results and limit to 20 to avoid overwhelming the UI
    return locations.filter((loc): loc is Location => loc !== null).slice(0, 20);
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};
