
import { Weather, OpenWeatherResponse } from '@/types';

// Demo API key for OpenWeatherMap
const API_KEY = '9de243494c0b295cca9337e1e96b00e2';

// Convert OpenWeatherMap icon code to our icon format
const mapWeatherIcon = (iconCode: string): string => {
  // Map OpenWeatherMap icon codes to our simplified icon names
  const iconMap: Record<string, string> = {
    '01d': 'sun', // clear sky day
    '01n': 'sun',  // clear sky night
    '02d': 'cloud-sun', // few clouds day
    '02n': 'cloud-sun', // few clouds night
    '03d': 'cloud', // scattered clouds
    '03n': 'cloud',
    '04d': 'cloud', // broken clouds
    '04n': 'cloud',
    '09d': 'cloud-rain', // shower rain
    '09n': 'cloud-rain',
    '10d': 'cloud-rain', // rain
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning', // thunderstorm
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow', // snow
    '13n': 'cloud-snow',
    '50d': 'cloud-fog', // mist
    '50n': 'cloud-fog'
  };
  
  return iconMap[iconCode] || 'cloud';
};

export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<Weather | null> => {
  try {
    console.log(`Getting weather for coordinates: ${lat}, ${lon}`);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    const data: OpenWeatherResponse = await response.json();
    
    if (data) {
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        icon: mapWeatherIcon(data.weather[0].icon),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export const getWeatherByCity = async (city: string): Promise<Weather | null> => {
  try {
    console.log(`Getting weather for city: ${city}`);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      console.error(`Weather API returned ${response.status} for ${city}`);
      return null;
    }
    
    const data: OpenWeatherResponse = await response.json();
    
    if (data) {
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        icon: mapWeatherIcon(data.weather[0].icon),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed)
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error);
    return null;
  }
};
