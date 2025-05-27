
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { CloudSun, Thermometer, Wind, Eye, Droplets, RefreshCw } from 'lucide-react';

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
  const [inputCity, setInputCity] = useState('London');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching weather for city:', cityName);
      const { data, error } = await supabase.functions.invoke('weather', {
        body: { city: cityName }
      });

      console.log('Weather API response:', { data, error });

      if (error) {
        console.error('Weather API error:', error);
        throw error;
      }

      if (data && data.name) {
        setWeatherData(data);
        setCity(cityName);
        console.log('Weather data set successfully for:', data.name);
      } else {
        throw new Error('Invalid weather data received');
      }
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('WeatherWidget mounted, fetching initial weather...');
    fetchWeather(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      fetchWeather(inputCity.trim());
    }
  };

  const handleRefresh = () => {
    fetchWeather(city);
  };

  return (
    <Card className="bg-white/10 border-white/20 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center">
            <CloudSun className="w-5 h-5 mr-2 text-yellow-400" />
            Weather
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
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
          <div className="text-red-400 text-sm p-4 bg-red-400/10 rounded border border-red-400/20">
            <div className="font-semibold mb-1">Error loading weather:</div>
            {error}
          </div>
        )}

        {loading && !weatherData && (
          <div className="text-center text-white/70 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-2"></div>
            Loading weather data...
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
              <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                <Thermometer className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <div className="text-sm text-white/60">Feels like</div>
                <div className="text-lg font-semibold text-white">
                  {Math.round(weatherData.main.feels_like)}°C
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-sm text-white/60">Humidity</div>
                <div className="text-lg font-semibold text-white">
                  {weatherData.main.humidity}%
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                <Wind className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <div className="text-sm text-white/60">Wind Speed</div>
                <div className="text-lg font-semibold text-white">
                  {weatherData.wind.speed} m/s
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
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
