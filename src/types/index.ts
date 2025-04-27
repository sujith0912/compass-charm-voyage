
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
  coordinates?: {
    lat: number;
    lon: number;
  };
  source?: string;
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

export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
  country: string;
}

export interface OpenTripMapPlace {
  xid: string;
  name: string;
  kinds: string;
  point: {
    lon: number;
    lat: number;
  };
  rate?: number;
  osm?: string;
  wikidata?: string;
  dist?: number;
  image?: string;
  preview?: {
    source: string;
    height: number;
    width: number;
  };
}

export interface OpenTripMapPlaceDetail {
  xid: string;
  name: string;
  address?: {
    city?: string;
    road?: string;
    state?: string;
    county?: string;
    country?: string;
    postcode?: string;
    country_code?: string;
    house_number?: string;
    neighbourhood?: string;
  };
  rate?: string;
  osm?: string;
  wikidata?: string;
  kinds?: string;
  sources?: {
    geometry: string;
    attributes: string[];
  };
  point?: {
    lon: number;
    lat: number;
  };
  bbox?: {
    lon_max: number;
    lon_min: number;
    lat_max: number;
    lat_min: number;
  };
  image?: string;
  preview?: {
    source: string;
    height: number;
    width: number;
  };
  wikipedia?: string;
  info?: {
    descr?: string;
    image?: string;
    img_width?: number;
    img_height?: number;
    src?: string;
    url?: string;
  };
  wikipedia_extracts?: {
    title?: string;
    text?: string;
    html?: string;
  };
}

export interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}
