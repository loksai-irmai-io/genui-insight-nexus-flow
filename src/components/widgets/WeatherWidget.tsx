
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { CloudSun, Thermometer, Wind, Eye, Droplets } from 'lucide-react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
}

export const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState('London');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('weather', {
        body: { city: cityName }
      });

      if (error) throw error;
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  return (
    <Card className="bg-white/10 border-white/20 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center">
            <CloudSun className="w-5 h-5 mr-2 text-yellow-400" />
            Weather
          </h3>
        </div>

        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Loading...' : 'Search'}
          </Button>
        </form>

        {error && (
          <div className="text-red-400 text-sm p-2 bg-red-400/10 rounded">
            {error}
          </div>
        )}

        {weatherData && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-xl font-bold text-white">{weatherData.name}</h4>
              <div className="flex items-center justify-center space-x-4 mt-2">
                <div className="text-3xl font-bold text-white">
                  {Math.round(weatherData.main.temp)}°C
                </div>
                <img 
                  src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                  alt={weatherData.weather[0].description}
                  className="w-16 h-16"
                />
              </div>
              <p className="text-white/80 capitalize">{weatherData.weather[0].description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Thermometer className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <div className="text-sm text-white/60">Feels like</div>
                <div className="text-lg font-semibold text-white">
                  {Math.round(weatherData.main.feels_like)}°C
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-sm text-white/60">Humidity</div>
                <div className="text-lg font-semibold text-white">
                  {weatherData.main.humidity}%
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Wind className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <div className="text-sm text-white/60">Wind Speed</div>
                <div className="text-lg font-semibold text-white">
                  {weatherData.wind.speed} m/s
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Eye className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-sm text-white/60">Visibility</div>
                <div className="text-lg font-semibold text-white">
                  {Math.round(weatherData.visibility / 1000)} km
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
