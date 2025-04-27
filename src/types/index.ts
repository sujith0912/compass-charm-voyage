
export interface Location {
  id: string;
  name: string;
  type: 'attraction' | 'hotel' | 'restaurant';
  description: string;
  address: string;
  rating: number;
  imageUrl: string;
  priceLevel?: string;
  category?: string;
  openingHours?: string[];
  amenities?: string[];
  reviews?: number;
  highlights?: string[];
}

export interface Weather {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  forecast?: {
    day: string;
    temperature: number;
    condition: string;
    icon: string;
  }[];
}

export interface City {
  name: string;
  country: string;
  description: string;
  imageUrl: string;
}

export interface LocationGroup {
  title: string;
  description: string;
  emoji: string;
  locations: Location[];
}

export interface TravelTip {
  text: string;
  category: 'general' | 'seasonal' | 'local' | 'budget';
  emoji: string;
}
