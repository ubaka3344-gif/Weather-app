import React from 'react';

export default function WeatherBackground({ condition = 'clear' }) {
  const isRain = ['rain', 'drizzle', 'showers', 'heavy-rain', 'freezing-rain'].includes(condition);
  const isSnow = condition === 'snow';
  const isNight = ['clear-night', 'partly-cloudy-night'].includes(condition);
  const isThunder = condition === 'thunderstorm';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 transition-colors duration-1000">
      {/* Dynamic ambient color gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sky-500/15 blur-[120px] animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-indigo-500/15 blur-[140px]" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-cyan-500/10 blur-[130px]" />

      {/* Special weather effects */}
      {isNight && (
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
      )}

      {isThunder && (
        <div className="absolute -top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[160px] animate-pulse" />
      )}

      {isRain && (
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(135deg,rgba(56,189,248,0.2)_1px,transparent_1px)] [background-size:24px_48px]" />
      )}

      {isSnow && (
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7)_1.5px,transparent_2px)] [background-size:40px_40px]" />
      )}
    </div>
  );
}
