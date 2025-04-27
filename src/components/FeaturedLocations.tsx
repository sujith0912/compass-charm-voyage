
import { useEffect, useState } from 'react';
import { City } from '@/types';
import { getFeaturedCities } from '@/services/api';
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';

interface FeaturedLocationsProps {
  onSelectCity: (city: string) => void;
}

const FeaturedLocations = ({ onSelectCity }: FeaturedLocationsProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const featuredCities = await getFeaturedCities();
        setCities(featuredCities);
      } catch (error) {
        console.error('Failed to load featured cities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-6">Popular Destinations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cities.map((city) => (
          <div 
            key={city.name}
            className="relative overflow-hidden rounded-lg h-64 group cursor-pointer animate-fade-in"
            onClick={() => onSelectCity(city.name)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
            <img 
              src={city.imageUrl} 
              alt={city.name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
            />
            <div className="absolute bottom-0 left-0 p-4 z-20 w-full">
              <h3 className="text-white text-xl font-semibold">{city.name}</h3>
              <p className="text-white/80 text-sm mb-3">{city.country}</p>
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/20 hover:bg-white/40 backdrop-blur text-white"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Explore
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedLocations;
