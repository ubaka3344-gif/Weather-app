# SkyPulse — Live Weather & Forecast Web App

SkyPulse is a real-time full-stack weather application with a dynamic glassmorphic interface that adapts its atmosphere, gradients, and visuals according to live weather conditions (Clear, Rain, Thunderstorm, Snow, Night, Overcast).

## Architecture & Tech Stack

```
weather-app/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── index.js          # Express app entry point & CORS configuration
│   │   ├── routes/
│   │   │   └── weatherRoutes.js # /api/weather, /api/search, /api/health
│   │   └── services/
│   │       └── weatherService.js # Open-Meteo client, AQI, WMO code mapper & caching
│   ├── package.json
│   └── .env
└── frontend/                 # React + Vite + Tailwind CSS v4
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Branding, local time, GPS location & °C/°F toggle
    │   │   ├── SearchBar.jsx     # Debounced search, autocomplete dropdown & quick city pills
    │   │   ├── CurrentWeather.jsx# Hero card, big temp, min/max, sunrise/sunset & glow
    │   │   ├── HourlyForecast.jsx# 24-hour horizontal forecast slider
    │   │   ├── DailyForecast.jsx # 7-day extended forecast with visual temp range bar
    │   │   ├── WeatherMetrics.jsx# AQI, Wind/Compass, UV Index, Humidity, Pressure, Precip
    │   │   ├── WeatherIcon.jsx   # Dynamic Lucide icons with condition glow
    │   │   └── WeatherBackground.jsx # Condition-based ambient gradient & particles
    │   ├── services/api.js   # API integration & theme definitions
    │   ├── App.jsx           # Main application state & dashboard layout
    │   └── index.css         # Tailwind v4 import & glassmorphic utilities
    ├── index.html            # Outfit typography & SEO meta tags
    ├── vite.config.js        # @tailwindcss/vite plugin
    └── package.json
```

---

## Features

- **Live Atmospheric Data**: Real-time temperature, condition description, humidity, wind direction & speed, atmospheric pressure, and precipitation.
- **Air Quality Index (AQI)**: US AQI rating with PM2.5, PM10, and health hazard category badges.
- **UV Index Tracker**: Peak daily UV index with categorized safety recommendations.
- **24-Hour Hourly Forecast**: Responsive horizontal scroll slider with hourly temperatures, icons, and rain probabilities.
- **7-Day Extended Forecast**: Extended daily weather overview featuring proportional temperature range bars.
- **Instant City Search & Autocomplete**: Debounced search with auto-suggest dropdown for cities globally.
- **Popular City Presets & Recent Searches**: 1-click access to major capitals and persistent history in localStorage.
- **Geolocation Support**: "My Location" button detects GPS coordinates and pulls local forecasts.
- **Unit Switching**: Seamlessly toggle between Celsius (°C) and Fahrenheit (°F).
- **Dynamic Weather Theming**: UI background and glow shift dynamically between sunny amber, rainy cyan, stormy violet, snowy frost, and midnight indigo.

---

## Running Locally

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm start
# Server starts on http://localhost:5000
```

### 2. Start the Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
# Vite runs on http://localhost:5173
```

Open `http://localhost:5173` in your web browser to use SkyPulse!
