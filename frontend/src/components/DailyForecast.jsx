import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../services/api';

export default function DailyForecast({ daily = [], unit }) {
  if (!daily || daily.length === 0) return null;

  const formatDay = (dateStr, idx) => {
    if (idx === 0) return 'Today';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    } catch {
      return dateStr;
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    } catch {
      return '';
    }
  };

  // Find global min and max across all 7 days for the visual bar proportion
  const allMins = daily.map((d) => d.minTemp);
  const allMaxs = daily.map((d) => d.maxTemp);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(globalMax - globalMin, 1);

  return (
    <div className="rounded-3xl glass-panel p-5 sm:p-6 mb-6 border border-white/10 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-sky-400" />
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          7-Day Forecast
        </h2>
      </div>

      <div className="divide-y divide-white/5 space-y-1">
        {daily.map((day, idx) => {
          // Calculate bar position
          const leftPercent = Math.max(0, ((day.minTemp - globalMin) / tempRange) * 100);
          const barWidthPercent = Math.max(12, ((day.maxTemp - day.minTemp) / tempRange) * 100);

          return (
            <div
              key={day.date}
              className="flex items-center justify-between py-3 px-2 sm:px-3 rounded-xl hover:bg-slate-900/40 transition-colors gap-2 sm:gap-4"
            >
              {/* Day & Date */}
              <div className="w-20 sm:w-28 shrink-0">
                <p className="text-sm font-semibold text-white">
                  {formatDay(day.date, idx)}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {formatDate(day.date)}
                </p>
              </div>

              {/* Icon & Condition Label */}
              <div className="flex items-center gap-2.5 w-32 sm:w-44 shrink-0">
                <WeatherIcon
                  icon={day.icon}
                  condition={day.condition}
                  className="w-6 h-6 shrink-0"
                />
                <span className="text-xs sm:text-sm text-slate-300 font-medium truncate hidden xs:inline">
                  {day.description}
                </span>
                {day.precipitationProbMax > 20 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-cyan-300 bg-cyan-950/60 px-1 py-0.5 rounded font-mono">
                    <Droplets className="w-2.5 h-2.5" />
                    {day.precipitationProbMax}%
                  </span>
                )}
              </div>

              {/* Min Temp */}
              <span className="w-10 text-right text-xs sm:text-sm font-medium text-sky-300">
                {formatTemp(day.minTemp, unit)}
              </span>

              {/* Visual Temperature Range Bar */}
              <div className="flex-1 max-w-xs h-2 bg-slate-800/80 rounded-full overflow-hidden relative hidden sm:block">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 shadow-sm"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${barWidthPercent}%`,
                  }}
                />
              </div>

              {/* Max Temp */}
              <span className="w-10 text-right text-xs sm:text-sm font-bold text-white">
                {formatTemp(day.maxTemp, unit)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
