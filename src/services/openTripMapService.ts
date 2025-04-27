
import { 
  OpenTripMapPlace, 
  OpenTripMapPlaceDetail, 
  GeocodeResult, 
  Location,
  LocationGroup 
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

// Improved function to get places around a location with pagination support
export const getPlacesNearby = async (
  lat: number, 
  lon: number, 
  radius: number = 5000, 
  limit: number = 50,
  kinds?: string
): Promise<OpenTripMapPlace[]> => {
  try {
    console.log(`Getting places near ${lat}, ${lon} with radius ${radius}m${kinds ? ` of kind ${kinds}` : ''}`);
    let url = `${BASE_URL}/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=${limit}`;
    
    // Add kinds filter if provided
    if (kinds) {
      url += `&kinds=${kinds}`;
    }
    
    url += `&apikey=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.features || !Array.isArray(data.features)) {
      console.error('Invalid response format from OpenTripMap:', data);
      return [];
    }
    
    return data.features.map((f: any) => ({
      xid: f.properties.xid,
      name: f.properties.name || 'Unnamed Place',
      kinds: f.properties.kinds,
      point: f.geometry.coordinates ? {
        lon: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1]
      } : undefined,
      rate: f.properties.rate,
      dist: f.properties.dist
    }));
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
    
    if (!response.ok) {
      console.error(`Failed to get details for ${xid}: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error getting place details for ${xid}:`, error);
    return null;
  }
};

// Improved function to convert OpenTripMap place to our Location format
export const convertToLocation = async (place: OpenTripMapPlace): Promise<Location | null> => {
  try {
    const details = await getPlaceDetails(place.xid);
    
    if (!details || !details.name) {
      console.log(`No details found for place: ${place.xid}`);
      return null;
    }

    const type = determineLocationType(place.kinds);
    const description = details.wikipedia_extracts?.text || 
                       details.info?.descr || 
                       `A ${type} worth checking out`;
    
    // Format the address
    const address = details.address ? 
      Object.values(details.address).filter(Boolean).join(', ') : 
      'Address not available';
      
    // Get image URL or use placeholder
    const imageUrl = details.preview?.source || 
                    details.image || 
                    `https://source.unsplash.com/400x300/?${encodeURIComponent(type)},${encodeURIComponent(details.name)}`;
    
    const rating = details.rate ? parseFloat(details.rate) : (3.5 + Math.random() * 1.5);
    
    // Extract highlights from kinds
    const kinds = place.kinds.split(',').map(k => k.trim());
    const highlights = kinds.slice(0, 3).map(k => {
      // Convert kinds to readable highlights
      const kindMap: Record<string, string> = {
        'museums': 'Museum',
        'historic': 'Historical',
        'natural': 'Nature',
        'amusements': 'Entertainment',
        'cultural': 'Cultural',
        'architecture': 'Architecture',
        'adult': 'Adult Only',
        'gardens': 'Gardens',
        'religion': 'Religious Site',
        'beaches': 'Beach',
        'foods': 'Food',
        'hotels': 'Accommodation'
      };
      
      // Find a match or return the capitalized kind
      for (const [key, value] of Object.entries(kindMap)) {
        if (k.includes(key)) return value;
      }
      return k.charAt(0).toUpperCase() + k.slice(1);
    });
    
    // Generate price level based on type and rating
    const priceLevel = type === 'hotel' 
      ? rating > 4.5 ? '$$$$' : rating > 4 ? '$$$' : rating > 3 ? '$$' : '$'
      : rating > 4.5 ? '$$$' : rating > 4 ? '$$' : '$';
    
    // Generate amenities for hotels and restaurants
    const amenities = type === 'hotel' 
      ? ['Wi-Fi', 'Air Conditioning', 'Parking', 'Restaurant'].slice(0, Math.floor(Math.random() * 3) + 2)
      : type === 'restaurant'
        ? ['Outdoor Seating', 'Takeout', 'Delivery', 'Reservations'].slice(0, Math.floor(Math.random() * 3) + 2)
        : undefined;
    
    return {
      id: place.xid,
      name: details.name,
      type,
      description: description.substring(0, 300) + (description.length > 300 ? '...' : ''),
      address,
      rating,
      imageUrl,
      priceLevel,
      highlights,
      amenities,
      coordinates: place.point ? {
        lat: place.point.lat,
        lon: place.point.lon
      } : undefined,
      source: 'OpenTripMap'
    };
  } catch (error) {
    console.error(`Error converting place ${place.xid} to location:`, error);
    return null;
  }
};

// Main function to search locations by place name with improved categorization
export const searchLocationsByPlace = async (placeName: string): Promise<Location[]> => {
  try {
    console.log(`Searching locations for place: ${placeName}`);
    
    // First, geocode the place name to get coordinates
    const geocoded = await geocodePlace(placeName);
    if (!geocoded) {
      console.error(`Could not geocode location: ${placeName}`);
      return [];
    }
    
    console.log(`Successfully geocoded ${placeName} to ${geocoded.lat}, ${geocoded.lon}`);
    
    // Define the categories we want to search for
    const categories = [
      { kind: 'interesting_places', limit: 20 },
      { kind: 'accomodations', limit: 15 },
      { kind: 'foods', limit: 15 }
    ];
    
    // Fetch places for each category
    const allPlacesPromises = categories.map(category => 
      getPlacesNearby(geocoded.lat, geocoded.lon, 10000, category.limit, category.kind)
    );
    
    const allPlaces = await Promise.all(allPlacesPromises);
    const flattenedPlaces = allPlaces.flat();
    
    console.log(`Found ${flattenedPlaces.length} places near ${placeName}`);
    
    // Filter out places without names
    const validPlaces = flattenedPlaces.filter(place => place.name && place.name !== 'Unnamed Place');
    
    // Convert each place to our Location format
    const locationPromises = validPlaces.map(place => convertToLocation(place));
    const locations = await Promise.all(locationPromises);
    
    // Filter out null results
    return locations.filter((loc): loc is Location => loc !== null);
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

// Group locations by type
export const groupLocationsByType = (locations: Location[]): LocationGroup[] => {
  const groups: Record<string, LocationGroup> = {
    attraction: {
      title: "Must-Visit Attractions",
      emoji: "🌟",
      description: "Incredible sights and experiences you can't miss!",
      locations: []
    },
    hotel: {
      title: "Cozy Places to Stay",
      emoji: "🏨",
      description: "Perfect spots to rest after your adventures",
      locations: []
    },
    restaurant: {
      title: "Delightful Dining Spots",
      emoji: "🍽️",
      description: "Local flavors and culinary experiences to savor",
      locations: []
    }
  };

  locations.forEach(location => {
    if (location.type in groups) {
      groups[location.type].locations.push(location);
    }
  });

  return Object.values(groups).filter(group => group.locations.length > 0);
};
