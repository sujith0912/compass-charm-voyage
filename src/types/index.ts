
export interface Location {
  id: string;
  name: string;
  type: 'attraction' | 'hotel' | 'restaurant';
  description: string;
  address: string;
  rating: number;
  imageUrl: string;
  priceLevel?: string;
}

export interface Weather {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface City {
  name: string;
  country: string;
  description: string;
  imageUrl: string;
}
