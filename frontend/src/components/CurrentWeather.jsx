import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Sunrise, Sunset, Clock } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../services/api';

export default function CurrentWeather({ weatherData, unit, theme }) {
  if (!weatherData) return null;

  const { location, current, daily } = weatherData;
  const today = daily && daily.length > 0 ? daily[0] : null;

  const formatSunTime = (isoString) => {
    if (!isoString) return '--:--';
    try {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date(isoString));
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 mb-6 border border-white/10 shadow-2xl transition-all">
      {/* Background radial glow matching the weather condition */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-60"
        style={{ background: theme.ambientGlow }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Location & Big Temp */}
        <div className="space-y-3">
          {/* Location pill */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <MapPin className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {location.name || 'Current Location'}
            </h1>
          </div>

          {/* Big Temperature & Condition */}
          <div className="flex items-baseline gap-4">
            <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-md">
              {formatTemp(current.temperature, unit)}
            </span>
            <div className="space-y-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${theme.badgeBg}`}>
                {current.description}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Feels like <span className="text-white font-semibold">{formatTemp(current.feelsLike, unit)}</span>
              </p>
            </div>
          </div>

          {/* Today's High and Low */}
          {today && (
            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
              <span className="flex items-center gap-1 font-medium text-emerald-400">
                <ArrowUp className="w-3.5 h-3.5" />
                High: {formatTemp(today.maxTemp, unit)}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 font-medium text-sky-400">
                <ArrowDown className="w-3.5 h-3.5" />
                Low: {formatTemp(today.minTemp, unit)}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Big Weather Icon & Sun Details */}
        <div className="flex flex-col items-center md:items-end justify-center gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-inner">
            <WeatherIcon
              icon={current.icon}
              condition={current.condition}
              className="w-24 h-24 sm:w-28 sm:h-28"
            />
          </div>

          {/* Sunrise / Sunset */}
          {today && (
            <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Sunrise className="w-4 h-4 text-amber-400" />
                <span>Sunrise <strong className="text-white ml-0.5">{formatSunTime(today.sunrise)}</strong></span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5">
                <Sunset className="w-4 h-4 text-orange-400" />
                <span>Sunset <strong className="text-white ml-0.5">{formatSunTime(today.sunset)}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
