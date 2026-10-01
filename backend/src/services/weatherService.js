// Weather code interpretation based on WMO Weather interpretation codes
export const WMO_CODE_MAP = {
  0: { label: 'Clear sky', condition: 'clear', icon: 'Sun' },
  1: { label: 'Mainly clear', condition: 'mainly-clear', icon: 'Sun' },
  2: { label: 'Partly cloudy', condition: 'partly-cloudy', icon: 'CloudSun' },
  3: { label: 'Overcast', condition: 'cloudy', icon: 'Cloud' },
  45: { label: 'Foggy', condition: 'fog', icon: 'CloudFog' },
  48: { label: 'Depositing rime fog', condition: 'fog', icon: 'CloudFog' },
  51: { label: 'Light drizzle', condition: 'drizzle', icon: 'CloudDrizzle' },
  53: { label: 'Moderate drizzle', condition: 'drizzle', icon: 'CloudDrizzle' },
  55: { label: 'Dense drizzle', condition: 'drizzle', icon: 'CloudDrizzle' },
  56: { label: 'Light freezing drizzle', condition: 'freezing-rain', icon: 'CloudSnow' },
  57: { label: 'Dense freezing drizzle', condition: 'freezing-rain', icon: 'CloudSnow' },
  61: { label: 'Slight rain', condition: 'rain', icon: 'CloudRain' },
  63: { label: 'Moderate rain', condition: 'rain', icon: 'CloudRain' },
  65: { label: 'Heavy rain', condition: 'heavy-rain', icon: 'CloudRain' },
  66: { label: 'Light freezing rain', condition: 'freezing-rain', icon: 'CloudSnow' },
  67: { label: 'Heavy freezing rain', condition: 'freezing-rain', icon: 'CloudSnow' },
  71: { label: 'Slight snow fall', condition: 'snow', icon: 'Snowflake' },
  73: { label: 'Moderate snow fall', condition: 'snow', icon: 'Snowflake' },
  75: { label: 'Heavy snow fall', condition: 'snow', icon: 'Snowflake' },
  77: { label: 'Snow grains', condition: 'snow', icon: 'Snowflake' },
  80: { label: 'Slight rain showers', condition: 'showers', icon: 'CloudRain' },
  81: { label: 'Moderate rain showers', condition: 'showers', icon: 'CloudRain' },
  82: { label: 'Violent rain showers', condition: 'heavy-rain', icon: 'CloudLightning' },
  85: { label: 'Slight snow showers', condition: 'snow', icon: 'Snowflake' },
  86: { label: 'Heavy snow showers', condition: 'snow', icon: 'Snowflake' },
  95: { label: 'Thunderstorm', condition: 'thunderstorm', icon: 'CloudLightning' },
  96: { label: 'Thunderstorm with slight hail', condition: 'thunderstorm', icon: 'CloudLightning' },
  99: { label: 'Thunderstorm with heavy hail', condition: 'thunderstorm', icon: 'CloudLightning' },
};

export function interpretWeatherCode(code, isDay = 1) {
  const defaultInfo = { label: 'Unknown', condition: 'cloudy', icon: 'Cloud' };
  const info = WMO_CODE_MAP[code] || defaultInfo;
  
  if (!isDay && (code === 0 || code === 1)) {
    return { ...info, label: info.label + ' (Night)', icon: 'Moon', condition: 'clear-night' };
  }
  if (!isDay && code === 2) {
    return { ...info, icon: 'CloudMoon', condition: 'partly-cloudy-night' };
  }
  
  return info;
}

export function mapOpenWeatherIcon(iconCode = '01d', mainDesc = '') {
  switch (iconCode) {
    case '01d':
      return { icon: 'Sun', condition: 'clear', label: 'Clear Sky' };
    case '01n':
      return { icon: 'Moon', condition: 'clear-night', label: 'Clear Sky (Night)' };
    case '02d':
      return { icon: 'CloudSun', condition: 'partly-cloudy', label: 'Few Clouds' };
    case '02n':
      return { icon: 'CloudMoon', condition: 'partly-cloudy-night', label: 'Few Clouds (Night)' };
    case '03d':
    case '03n':
      return { icon: 'Cloud', condition: 'cloudy', label: 'Scattered Clouds' };
    case '04d':
    case '04n':
      return { icon: 'Cloud', condition: 'cloudy', label: 'Overcast' };
    case '09d':
    case '09n':
      return { icon: 'CloudDrizzle', condition: 'drizzle', label: 'Drizzle & Showers' };
    case '10d':
      return { icon: 'CloudRain', condition: 'rain', label: 'Rain' };
    case '10n':
      return { icon: 'CloudRain', condition: 'rain', label: 'Rain (Night)' };
    case '11d':
    case '11n':
      return { icon: 'CloudLightning', condition: 'thunderstorm', label: 'Thunderstorm' };
    case '13d':
    case '13n':
      return { icon: 'Snowflake', condition: 'snow', label: 'Snow' };
    case '50d':
    case '50n':
      return { icon: 'CloudFog', condition: 'fog', label: 'Mist / Fog' };
    default:
      return { icon: 'Cloud', condition: 'cloudy', label: mainDesc || 'Cloudy' };
  }
}

// In-memory cache with TTL
class SimpleCache {
  constructor(ttlMs = 5 * 60 * 1000) {
    this.cache = new Map();
    this.ttlMs = ttlMs;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  set(key, data, customTtlMs) {
    const expiresAt = Date.now() + (customTtlMs || this.ttlMs);
    this.cache.set(key, { data, expiresAt });
  }
}

export const weatherCache = new SimpleCache(5 * 60 * 1000); // 5 minutes
export const searchCache = new SimpleCache(15 * 60 * 1000); // 15 minutes for search

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  const normalizedQuery = query.trim().toLowerCase();
  const cached = searchCache.get(normalizedQuery);
  if (cached) return cached;

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    normalizedQuery
  )}&count=8&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.statusText}`);
  }

  const data = await response.json();
  const results = (data.results || []).map((item) => ({
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    country: item.country || '',
    countryCode: item.country_code || '',
    admin1: item.admin1 || '',
    timezone: item.timezone || 'auto',
  }));

  searchCache.set(normalizedQuery, results);
  return results;
}

/**
 * Fetch weather from OpenWeatherMap if API key is present
 */
async function fetchOpenWeatherMapData(lat, lon, locationName, apiKey) {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const aqiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const [currentRes, forecastRes, aqiRes] = await Promise.all([
    fetch(currentUrl),
    fetch(forecastUrl),
    fetch(aqiUrl).catch(() => null),
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    throw new Error('OpenWeatherMap API request failed');
  }

  const currentJson = await currentRes.json();
  const forecastJson = await forecastRes.json();
  const aqiJson = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

  const weatherMain = currentJson.weather && currentJson.weather[0] ? currentJson.weather[0] : {};
  const mapped = mapOpenWeatherIcon(weatherMain.icon, weatherMain.main);

  const current = {
    time: new Date(currentJson.dt * 1000).toISOString(),
    temperature: Math.round(currentJson.main.temp),
    feelsLike: Math.round(currentJson.main.feels_like),
    humidity: currentJson.main.humidity,
    windSpeed: Math.round(currentJson.wind.speed * 3.6), // m/s to km/h
    windDirection: currentJson.wind.deg || 0,
    pressure: currentJson.main.pressure,
    precipitation: currentJson.rain ? currentJson.rain['1h'] || 0 : 0,
    isDay: (weatherMain.icon || '').includes('d'),
    weatherCode: weatherMain.id,
    condition: mapped.condition,
    description: weatherMain.description ? weatherMain.description.charAt(0).toUpperCase() + weatherMain.description.slice(1) : mapped.label,
    icon: mapped.icon,
  };

  // Hourly (from 3-hour forecast slots)
  const hourly = (forecastJson.list || []).slice(0, 8).map((slot) => {
    const slotWeather = slot.weather && slot.weather[0] ? slot.weather[0] : {};
    const slotMapped = mapOpenWeatherIcon(slotWeather.icon, slotWeather.main);
    return {
      time: slot.dt_txt,
      temperature: Math.round(slot.main.temp),
      humidity: slot.main.humidity,
      precipitationProb: Math.round((slot.pop || 0) * 100),
      windSpeed: Math.round(slot.wind.speed * 3.6),
      weatherCode: slotWeather.id,
      condition: slotMapped.condition,
      description: slotWeather.description || slotMapped.label,
      icon: slotMapped.icon,
      uvIndex: null,
    };
  });

  // Group 5-day daily forecast
  const dailyMap = new Map();
  for (const slot of forecastJson.list || []) {
    const dateKey = slot.dt_txt.split(' ')[0];
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        date: dateKey,
        temps: [],
        weathers: [],
        pop: 0,
        windMax: 0,
      });
    }
    const dayObj = dailyMap.get(dateKey);
    dayObj.temps.push(slot.main.temp_min, slot.main.temp_max);
    if (slot.weather && slot.weather[0]) dayObj.weathers.push(slot.weather[0]);
    if (slot.pop > dayObj.pop) dayObj.pop = slot.pop;
    const windKmh = (slot.wind.speed || 0) * 3.6;
    if (windKmh > dayObj.windMax) dayObj.windMax = windKmh;
  }

  const daily = Array.from(dailyMap.values()).map((d, index) => {
    const minTemp = Math.round(Math.min(...d.temps));
    const maxTemp = Math.round(Math.max(...d.temps));
    const midWeather = d.weathers[Math.floor(d.weathers.length / 2)] || {};
    const mappedDay = mapOpenWeatherIcon(midWeather.icon || '01d', midWeather.main);

    return {
      date: d.date,
      maxTemp,
      minTemp,
      precipitationSum: 0,
      precipitationProbMax: Math.round(d.pop * 100),
      windSpeedMax: Math.round(d.windMax),
      uvIndexMax: 4,
      sunrise: index === 0 && currentJson.sys ? new Date(currentJson.sys.sunrise * 1000).toISOString() : null,
      sunset: index === 0 && currentJson.sys ? new Date(currentJson.sys.sunset * 1000).toISOString() : null,
      weatherCode: midWeather.id || 800,
      condition: mappedDay.condition,
      description: midWeather.description ? midWeather.description.charAt(0).toUpperCase() + midWeather.description.slice(1) : mappedDay.label,
      icon: mappedDay.icon,
    };
  });

  // Air Quality
  let airQuality = null;
  if (aqiJson && aqiJson.list && aqiJson.list[0]) {
    const item = aqiJson.list[0];
    const aqiLevel = item.main.aqi; // 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
    const aqiMap = {
      1: { usAqi: 25, category: 'Good', color: '#10b981' },
      2: { usAqi: 65, category: 'Moderate', color: '#f59e0b' },
      3: { usAqi: 110, category: 'Unhealthy for Sensitive Groups', color: '#f97316' },
      4: { usAqi: 160, category: 'Unhealthy', color: '#ef4444' },
      5: { usAqi: 220, category: 'Very Unhealthy', color: '#881337' },
    };
    const info = aqiMap[aqiLevel] || aqiMap[1];
    airQuality = {
      usAqi: info.usAqi,
      category: info.category,
      color: info.color,
      pm2_5: item.components.pm2_5,
      pm10: item.components.pm10,
      ozone: item.components.o3,
      nitrogenDioxide: item.components.no2,
    };
  }

  return {
    provider: 'OpenWeatherMap',
    location: {
      name: locationName || `${currentJson.name}, ${currentJson.sys?.country || ''}`,
      latitude: lat,
      longitude: lon,
      timezone: forecastJson.city?.timezone ? `UTC${forecastJson.city.timezone >= 0 ? '+' : ''}${forecastJson.city.timezone / 3600}` : 'auto',
      elevation: 0,
    },
    units: {
      temperature: '°C',
      windSpeed: 'km/h',
    },
    current,
    hourly,
    daily,
    airQuality,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Fetch weather data via OpenWeatherMap (if API key available) or fallback to Open-Meteo
 */
export async function fetchWeatherData(lat, lon, timezone = 'auto', locationName = '') {
  const apiKey = process.env.VITE_WEATHER_API_KEY || process.env.WEATHER_API_KEY;
  const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}_${apiKey ? 'owm' : 'om'}`;
  const cached = weatherCache.get(cacheKey);
  if (cached) return cached;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const result = await fetchOpenWeatherMapData(lat, lon, locationName, apiKey.trim());
      weatherCache.set(cacheKey, result);
      return result;
    } catch (err) {
      console.warn('OpenWeatherMap request failed, falling back to Open-Meteo:', err.message);
    }
  }

  // Fallback to Open-Meteo
  const forecastParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: timezone || 'auto',
    forecast_days: '7',
  });

  const forecastUrl = `https://api.open-meteo.com/v1/forecast?${forecastParams.toString()}`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;

  const [forecastRes, aqiRes] = await Promise.all([
    fetch(forecastUrl),
    fetch(aqiUrl).catch(() => null),
  ]);

  if (!forecastRes.ok) {
    throw new Error(`Open-Meteo forecast failed with status ${forecastRes.status}`);
  }

  const forecastData = await forecastRes.json();
  const aqiData = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

  const currentRaw = forecastData.current;
  const currentWeatherInfo = interpretWeatherCode(currentRaw.weather_code, currentRaw.is_day);

  const current = {
    time: currentRaw.time,
    temperature: Math.round(currentRaw.temperature_2m),
    feelsLike: Math.round(currentRaw.apparent_temperature),
    humidity: currentRaw.relative_humidity_2m,
    windSpeed: Math.round(currentRaw.wind_speed_10m),
    windDirection: currentRaw.wind_direction_10m,
    pressure: Math.round(currentRaw.surface_pressure),
    precipitation: currentRaw.precipitation,
    isDay: Boolean(currentRaw.is_day),
    weatherCode: currentRaw.weather_code,
    condition: currentWeatherInfo.condition,
    description: currentWeatherInfo.label,
    icon: currentWeatherInfo.icon,
  };

  const hourlyRaw = forecastData.hourly;
  const now = new Date(currentRaw.time).getTime();
  const hourly = [];
  
  for (let i = 0; i < hourlyRaw.time.length && hourly.length < 24; i++) {
    const timeVal = new Date(hourlyRaw.time[i]).getTime();
    if (timeVal >= now - 3600000) {
      const info = interpretWeatherCode(hourlyRaw.weather_code[i], 1);
      hourly.push({
        time: hourlyRaw.time[i],
        temperature: Math.round(hourlyRaw.temperature_2m[i]),
        humidity: hourlyRaw.relative_humidity_2m[i],
        precipitationProb: hourlyRaw.precipitation_probability[i] || 0,
        windSpeed: Math.round(hourlyRaw.wind_speed_10m[i]),
        weatherCode: hourlyRaw.weather_code[i],
        condition: info.condition,
        description: info.label,
        icon: info.icon,
        uvIndex: hourlyRaw.uv_index ? hourlyRaw.uv_index[i] : null,
      });
    }
  }

  const dailyRaw = forecastData.daily;
  const daily = [];
  for (let i = 0; i < (dailyRaw.time || []).length; i++) {
    const info = interpretWeatherCode(dailyRaw.weather_code[i], 1);
    daily.push({
      date: dailyRaw.time[i],
      maxTemp: Math.round(dailyRaw.temperature_2m_max[i]),
      minTemp: Math.round(dailyRaw.temperature_2m_min[i]),
      precipitationSum: dailyRaw.precipitation_sum[i],
      precipitationProbMax: dailyRaw.precipitation_probability_max[i] || 0,
      windSpeedMax: Math.round(dailyRaw.wind_speed_10m_max[i]),
      uvIndexMax: dailyRaw.uv_index_max[i],
      sunrise: dailyRaw.sunrise[i],
      sunset: dailyRaw.sunset[i],
      weatherCode: dailyRaw.weather_code[i],
      condition: info.condition,
      description: info.label,
      icon: info.icon,
    });
  }

  let airQuality = null;
  if (aqiData && aqiData.current) {
    const usAqi = aqiData.current.us_aqi;
    let aqiCategory = 'Good';
    let aqiColor = '#10b981';
    if (usAqi > 50 && usAqi <= 100) {
      aqiCategory = 'Moderate';
      aqiColor = '#f59e0b';
    } else if (usAqi > 100 && usAqi <= 150) {
      aqiCategory = 'Unhealthy for Sensitive Groups';
      aqiColor = '#f97316';
    } else if (usAqi > 150 && usAqi <= 200) {
      aqiCategory = 'Unhealthy';
      aqiColor = '#ef4444';
    } else if (usAqi > 200) {
      aqiCategory = 'Very Unhealthy';
      aqiColor = '#881337';
    }

    airQuality = {
      usAqi,
      category: aqiCategory,
      color: aqiColor,
      pm2_5: aqiData.current.pm2_5,
      pm10: aqiData.current.pm10,
      ozone: aqiData.current.ozone,
      nitrogenDioxide: aqiData.current.nitrogen_dioxide,
    };
  }

  const result = {
    provider: 'Open-Meteo',
    location: {
      name: locationName,
      latitude: lat,
      longitude: lon,
      timezone: forecastData.timezone,
      elevation: forecastData.elevation,
    },
    units: forecastData.current_units,
    current,
    hourly,
    daily,
    airQuality,
    fetchedAt: new Date().toISOString(),
  };

  weatherCache.set(cacheKey, result);
  return result;
}
