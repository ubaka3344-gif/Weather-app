import React from 'react';
import {
  Wind,
  Droplets,
  Gauge,
  Sun,
  Activity,
  Compass,
  CloudRain,
  Eye,
} from 'lucide-react';
import { formatWind } from '../services/api';

export default function WeatherMetrics({ weatherData, unit }) {
  if (!weatherData) return null;

  const { current, airQuality, daily } = weatherData;
  const today = daily && daily.length > 0 ? daily[0] : null;

  // UV index category helper
  const getUvLevel = (uv) => {
    if (uv === null || uv === undefined) return { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (uv <= 2) return { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    if (uv <= 10) return { label: 'Very High', color: 'text-rose-400', bg: 'bg-rose-500/20' };
    return { label: 'Extreme', color: 'text-purple-400', bg: 'bg-purple-500/20' };
  };

  // Humidity comfort category
  const getHumidityStatus = (humidity) => {
    if (humidity < 30) return 'Dry';
    if (humidity <= 60) return 'Comfortable';
    if (humidity <= 75) return 'Humid';
    return 'Very Humid';
  };

  const uvValue = today ? today.uvIndexMax : 2;
  const uvInfo = getUvLevel(uvValue);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {/* 1. Air Quality Index (AQI) */}
      <div className="rounded-3xl glass-panel p-5 border border-white/10 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Air Quality (AQI)
          </span>
          {airQuality && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
              style={{
                color: airQuality.color,
                backgroundColor: `${airQuality.color}20`,
                borderColor: `${airQuality.color}40`,
              }}
            >
              {airQuality.category}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl sm:text-4xl font-black text-white">
            {airQuality ? airQuality.usAqi : '35'}
          </span>
          <span className="text-xs text-slate-400 font-mono">US AQI Index</span>
        </div>

        {airQuality && (
          <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-white/5 pt-2">
            <span>PM2.5: <strong className="text-slate-200">{airQuality.pm2_5 || '0'} µg/m³</strong></span>
            <span>PM10: <strong className="text-slate-200">{airQuality.pm10 || '0'} µg/m³</strong></span>
          </div>
        )}
      </div>

      {/* 2. Wind & Direction */}
      <div className="rounded-3xl glass-panel p-5 border border-white/10 shadow-lg relative overflow-hidden group hover:border-teal-500/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            Wind & Direction
          </span>
          <div className="flex items-center gap-1 text-xs text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
            <Compass
              className="w-3.5 h-3.5 transition-transform duration-500"
              style={{ transform: `rotate(${current.windDirection || 0}deg)` }}
            />
            <span>{current.windDirection}°</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl sm:text-4xl font-black text-white">
            {formatWind(current.windSpeed, unit)}
          </span>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/5 pt-2 flex justify-between">
          <span>Direction: <strong className="text-slate-200">{current.windDirection}° Azimuth</strong></span>
          {today && <span>Max gusts: <strong className="text-slate-200">{formatWind(today.windSpeedMax, unit)}</strong></span>}
        </div>
      </div>

      {/* 3. UV Index */}
      <div className="rounded-3xl glass-panel p-5 border border-white/10 shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            UV Index
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${uvInfo.bg} ${uvInfo.color}`}>
            {uvInfo.label}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl sm:text-4xl font-black text-white">
            {uvValue !== null && uvValue !== undefined ? uvValue : '--'}
          </span>
          <span className="text-xs text-slate-400">Peak today</span>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/5 pt-2">
          <span>{uvValue <= 2 ? 'Minimal sun protection required' : 'Wear sunscreen & UV sunglasses outdoors'}</span>
        </div>
      </div>

      {/* 4. Humidity */}
      <div className="rounded-3xl glass-panel p-5 border border-white/10 shadow-lg relative overflow-hidden group hover:border-sky-500/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            Humidity
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300">
            {getHumidityStatus(current.humidity)}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl sm:text-4xl font-black text-white">
            {current.humidity}%
          </span>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/5 pt-2">
          <span>Atmospheric moisture level</span>
        </div>
      </div>

      {/* 5. Pressure */}
      <div className="rounded-3xl glass-panel p-5 border border-white/10 shadow-lg relative overflow-hidden group hover:border-indigo-500/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            Pressure
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300">
            {current.pressure >= 1013 ? 'Normal/High' : 'Low Pressure'}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl sm:text-4xl font-black text-white">
            {current.pressure}
          </span>
          <span className="text-xs text-slate-400 font-mono">hPa</span>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/5 pt-2">
          <span>Sea-level calibrated barometric pressure</span>
        </div>
      </div>

      {/* 6. Precipitation */}
      <div className="rounded-3xl glass-panel p-5 border border-white/10 shadow-lg relative overflow-hidden group hover:border-cyan-500/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            Precipitation
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300">
            {today ? `${today.precipitationProbMax}% chance` : '0%'}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl sm:text-4xl font-black text-white">
            {current.precipitation || 0}
          </span>
          <span className="text-xs text-slate-400 font-mono">mm current</span>
        </div>

        <div className="text-xs text-slate-400 border-t border-white/5 pt-2">
          <span>Today total expected: <strong className="text-slate-200">{today ? today.precipitationSum : 0} mm</strong></span>
        </div>
      </div>
    </div>
  );
}
