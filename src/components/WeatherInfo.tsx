
import { Weather } from '@/types';
import { Sun, CloudSun, CloudRain, Cloud } from 'lucide-react';

interface WeatherInfoProps {
  weather: Weather | null;
  city: string;
}

const WeatherInfo = ({ weather, city }: WeatherInfoProps) => {
  if (!weather) return null;

  const getWeatherIcon = () => {
    switch (weather.icon) {
      case 'sun':
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'cloud-sun':
        return <CloudSun className="h-8 w-8 text-gray-400" />;
      case 'cloud-rain':
        return <CloudRain className="h-8 w-8 text-blue-400" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Weather in {city}</h3>
          <p className="text-sm text-gray-500">{weather.condition}</p>
        </div>
        {getWeatherIcon()}
      </div>
      
      <div className="mt-4 flex items-center">
        <div className="text-3xl font-semibold">{weather.temperature}°C</div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-500">
        <div>
          <span className="block">Humidity</span>
          <span className="font-medium">{weather.humidity}%</span>
        </div>
        <div>
          <span className="block">Wind</span>
          <span className="font-medium">{weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherInfo;
