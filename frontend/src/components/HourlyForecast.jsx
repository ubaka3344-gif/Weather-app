import React from 'react';
import { Clock, Droplets, Wind } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../services/api';

export default function HourlyForecast({ hourly = [], unit }) {
  if (!hourly || hourly.length === 0) return null;

  const formatHour = (isoString, idx) => {
    if (idx === 0) return 'Now';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: true,
      }).format(date);
    } catch {
      return '--';
    }
  };

  return (
    <div className="rounded-3xl glass-panel p-5 sm:p-6 mb-6 border border-white/10 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-sky-400" />
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Hourly Forecast (Next 24 Hours)
        </h2>
      </div>

      {/* Horizontal Slider */}
      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 custom-scrollbar scroll-smooth">
        {hourly.map((item, idx) => {
          const hourLabel = formatHour(item.time, idx);
          const hasRain = item.precipitationProb > 0;

          return (
            <div
              key={item.time}
              className={`shrink-0 w-24 sm:w-28 flex flex-col items-center justify-between p-3.5 rounded-2xl transition-all duration-200 ${
                idx === 0
                  ? 'bg-sky-500/20 border border-sky-500/40 shadow-md shadow-sky-500/10'
                  : 'bg-slate-900/50 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Hour Label */}
              <span className={`text-xs font-semibold ${idx === 0 ? 'text-sky-300' : 'text-slate-300'}`}>
                {hourLabel}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5">
                <WeatherIcon
                  icon={item.icon}
                  condition={item.condition}
                  className="w-8 h-8"
                />
              </div>

              {/* Temperature */}
              <span className="text-base sm:text-lg font-bold text-white">
                {formatTemp(item.temperature, unit)}
              </span>

              {/* Precipitation Probability or Status */}
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium">
                {hasRain ? (
                  <span className="flex items-center gap-0.5 text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded-md border border-cyan-800/50">
                    <Droplets className="w-3 h-3" />
                    {item.precipitationProb}%
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">0%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
