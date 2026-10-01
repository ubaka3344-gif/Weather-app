const BACKEND_URL = 'http://localhost:5000/api';

/**
 * Fetch weather data for a city or coordinates
 */
export async function getWeatherData({ city, lat, lon }) {
  let url = `${BACKEND_URL}/weather?`;
  if (lat && lon) {
    url += `lat=${lat}&lon=${lon}${city ? `&city=${encodeURIComponent(city)}` : ''}`;
  } else {
    url += `city=${encodeURIComponent(city || 'London')}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch weather data');
    }
    return data.data;
  } catch (err) {
    // If backend connection fails, provide clear descriptive error or fallback
    throw new Error(err.message || 'Unable to connect to SkyPulse Weather service.');
  }
}

/**
 * Autocomplete search for cities
 */
export async function searchCitiesApi(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(`${BACKEND_URL}/search?q=${encodeURIComponent(query.trim())}`);
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.warn('Search query error:', err);
    return [];
  }
}

/**
 * Temperature converter helper
 */
export function formatTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  if (unit === 'F') {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/**
 * Wind speed converter helper
 */
export function formatWind(kmh, unit = 'C') {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
  if (unit === 'F') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Dynamic theme background metadata based on weather condition
 */
export function getWeatherTheme(condition = 'clear') {
  switch (condition) {
    case 'clear':
      return {
        bgGradient: 'from-amber-500/20 via-sky-600/25 to-slate-950',
        ambientGlow: 'rgba(245, 158, 11, 0.18)',
        accentColor: '#f59e0b',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        cardBorder: 'hover:border-amber-500/40',
        label: 'Clear Skies',
      };
    case 'clear-night':
      return {
        bgGradient: 'from-indigo-950/70 via-purple-950/50 to-slate-950',
        ambientGlow: 'rgba(129, 140, 248, 0.15)',
        accentColor: '#818cf8',
        badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        cardBorder: 'hover:border-indigo-500/40',
        label: 'Clear Night',
      };
    case 'partly-cloudy':
    case 'mainly-clear':
      return {
        bgGradient: 'from-sky-600/25 via-slate-800/40 to-slate-950',
        ambientGlow: 'rgba(56, 189, 248, 0.18)',
        accentColor: '#38bdf8',
        badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        cardBorder: 'hover:border-sky-500/40',
        label: 'Partly Cloudy',
      };
    case 'partly-cloudy-night':
      return {
        bgGradient: 'from-slate-900 via-indigo-950/60 to-slate-950',
        ambientGlow: 'rgba(99, 102, 241, 0.15)',
        accentColor: '#a5b4fc',
        badgeBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',
        cardBorder: 'hover:border-indigo-500/40',
        label: 'Partly Cloudy Night',
      };
    case 'cloudy':
    case 'fog':
      return {
        bgGradient: 'from-slate-700/30 via-zinc-800/40 to-slate-950',
        ambientGlow: 'rgba(148, 163, 184, 0.12)',
        accentColor: '#94a3b8',
        badgeBg: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
        cardBorder: 'hover:border-slate-400/40',
        label: 'Overcast & Fog',
      };
    case 'drizzle':
    case 'rain':
    case 'showers':
    case 'freezing-rain':
      return {
        bgGradient: 'from-cyan-900/35 via-blue-950/50 to-slate-950',
        ambientGlow: 'rgba(6, 182, 212, 0.18)',
        accentColor: '#06b6d4',
        badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        cardBorder: 'hover:border-cyan-500/40',
        label: 'Rain & Showers',
      };
    case 'heavy-rain':
    case 'thunderstorm':
      return {
        bgGradient: 'from-purple-950/60 via-slate-900/80 to-slate-950',
        ambientGlow: 'rgba(168, 85, 247, 0.22)',
        accentColor: '#c084fc',
        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        cardBorder: 'hover:border-purple-500/40',
        label: 'Thunderstorm',
      };
    case 'snow':
      return {
        bgGradient: 'from-blue-200/15 via-slate-800/30 to-slate-950',
        ambientGlow: 'rgba(224, 242, 254, 0.2)',
        accentColor: '#bae6fd',
        badgeBg: 'bg-sky-200/20 text-sky-200 border-sky-300/30',
        cardBorder: 'hover:border-sky-300/40',
        label: 'Snowfall',
      };
    default:
      return {
        bgGradient: 'from-sky-700/20 via-slate-900/60 to-slate-950',
        ambientGlow: 'rgba(56, 189, 248, 0.15)',
        accentColor: '#38bdf8',
        badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        cardBorder: 'hover:border-sky-500/40',
        label: 'Atmospheric',
      };
  }
}
