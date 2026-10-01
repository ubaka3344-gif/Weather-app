import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, History } from 'lucide-react';
import { searchCitiesApi } from '../services/api';

const QUICK_CITIES = ['London', 'Tokyo', 'New York', 'Paris', 'Dubai', 'Sydney'];

export default function SearchBar({ onSelectCity, onSelectCoords, recentCities = [] }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchCitiesApi(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error('Failed to search cities', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (city) => {
    setQuery('');
    setIsOpen(false);
    onSelectCoords({
      lat: city.latitude,
      lon: city.longitude,
      city: `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}${city.country ? ', ' + city.country : ''}`,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    } else {
      onSelectCity(query.trim());
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6" ref={containerRef}>
      {/* Search Input Box */}
      <form onSubmit={handleFormSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="Search city or location (e.g. Tokyo, Paris, Mumbai)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 focus:border-sky-500/70 text-slate-100 placeholder-slate-400 outline-none shadow-xl shadow-black/20 text-sm sm:text-base transition-all focus:ring-4 focus:ring-sky-500/15"
          />

          {isLoading && (
            <Loader2 className="absolute right-4 w-4 h-4 text-sky-400 animate-spin" />
          )}

          {!isLoading && query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="absolute right-3.5 p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 shadow-2xl shadow-black/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 divide-y divide-slate-800">
              {suggestions.map((city) => (
                <button
                  key={`${city.id}-${city.latitude}-${city.longitude}`}
                  type="button"
                  onClick={() => handleSelectSuggestion(city)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left hover:bg-slate-800/80 transition-colors text-slate-200 cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-sky-500/20 text-slate-400 group-hover:text-sky-400 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-100 group-hover:text-sky-300 truncate">
                      {city.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  {city.countryCode && (
                    <span className="text-xs font-mono text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {city.countryCode}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Quick City Presets */}
      <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs text-slate-400 custom-scrollbar">
        <span className="shrink-0 text-slate-400 font-medium mr-1 hidden sm:inline">Popular:</span>
        {QUICK_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => onSelectCity(city)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-slate-800 hover:text-sky-300 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            {city}
          </button>
        ))}

        {recentCities.length > 0 && (
          <>
            <span className="text-slate-400 mx-1">|</span>
            <span className="shrink-0 text-slate-400 font-medium flex items-center gap-1">
              <History className="w-3 h-3" /> Recent:
            </span>
            {recentCities.slice(0, 3).map((city) => (
              <button
                key={`recent-${city}`}
                type="button"
                onClick={() => onSelectCity(city)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
              >
                {city.split(',')[0]}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
