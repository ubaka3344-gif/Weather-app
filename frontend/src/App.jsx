import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherMetrics from './components/WeatherMetrics';
import WeatherBackground from './components/WeatherBackground';
import { getWeatherData, getWeatherTheme } from './services/api';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C');
  const [isLocating, setIsLocating] = useState(false);
  const [currentCityQuery, setCurrentCityQuery] = useState('London');
  const [recentCities, setRecentCities] = useState(() => {
    try {
      const saved = localStorage.getItem('skypulse_recent_cities');
      return saved ? JSON.parse(saved) : ['London', 'Tokyo', 'New York'];
    } catch {
      return ['London', 'Tokyo', 'New York'];
    }
  });

  const saveRecentCity = (cityName) => {
    if (!cityName) return;
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
      const updated = [cityName, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('skypulse_recent_cities', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const loadWeather = async ({ city, lat, lon }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherData({ city, lat, lon });
      setWeatherData(data);
      if (data.location?.name) {
        saveRecentCity(data.location.name);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to retrieve weather data. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadWeather({ city: 'London' });
  }, []);

  // Geolocation handler
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        loadWeather({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          city: 'My Location',
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert('Could not access your location. Please check browser permissions or search for a city directly.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const currentCondition = weatherData?.current?.condition || 'clear';
  const currentTheme = getWeatherTheme(currentCondition);

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentTheme.bgGradient} text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white transition-colors duration-700`}>
      <WeatherBackground condition={currentCondition} />

      {/* Navbar */}
      <Navbar
        unit={unit}
        onToggleUnit={setUnit}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
        locationName={weatherData?.location?.name}
        timezone={weatherData?.location?.timezone}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Bar */}
        <SearchBar
          onSelectCity={(city) => {
            setCurrentCityQuery(city);
            loadWeather({ city });
          }}
          onSelectCoords={({ lat, lon, city }) => {
            setCurrentCityQuery(city);
            loadWeather({ lat, lon, city });
          }}
          recentCities={recentCities}
        />

        {/* Loading State */}
        {isLoading && !weatherData && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-full border-4 border-sky-400 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm font-medium text-slate-300 animate-pulse">
              Retrieving live atmospheric forecast...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-xl mx-auto my-12 p-6 rounded-3xl bg-rose-950/40 border border-rose-500/30 backdrop-blur-xl text-center shadow-2xl">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Weather Forecast Unavailable</h3>
            <p className="text-sm text-rose-200/80 mb-5">{error}</p>
            <button
              onClick={() => loadWeather({ city: currentCityQuery || 'London' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm transition-all shadow-lg shadow-rose-500/20 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Weather Dashboard Content */}
        {weatherData && (
          <div className="animate-in fade-in duration-500 space-y-6">
            {/* Hero Current Weather */}
            <CurrentWeather
              weatherData={weatherData}
              unit={unit}
              theme={currentTheme}
            />

            {/* 24-Hour Hourly Forecast */}
            <HourlyForecast
              hourly={weatherData.hourly}
              unit={unit}
            />

            {/* Weather Metrics (AQI, Wind, UV, Humidity, etc.) */}
            <WeatherMetrics
              weatherData={weatherData}
              unit={unit}
            />

            {/* 7-Day Extended Forecast */}
            <DailyForecast
              daily={weatherData.daily}
              unit={unit}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 backdrop-blur-md bg-slate-950/40 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">SkyPulse Weather</span>
            <span>•</span>
            <span>React + Vite + Tailwind CSS + Express</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline font-medium"
            >
              Open-Meteo API
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
