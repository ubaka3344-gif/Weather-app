import { Router } from 'express';
import { searchCities, fetchWeatherData } from '../services/weatherService.js';

const router = Router();

// Search endpoint for city auto-complete
router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query || query.trim().length < 2) {
      return res.json({ success: true, results: [] });
    }
    const results = await searchCities(query);
    res.json({ success: true, results });
  } catch (error) {
    next(error);
  }
});

// Weather endpoint: accepts city name or latitude & longitude
router.get('/weather', async (req, res, next) => {
  try {
    let { lat, lon, city, timezone } = req.query;
    let locationName = city || '';

    if ((!lat || !lon) && !city) {
      // Default to London if nothing specified
      city = 'London';
    }

    if (!lat || !lon) {
      // Resolve coordinates from city name
      const searchResults = await searchCities(city);
      if (!searchResults || searchResults.length === 0) {
        return res.status(404).json({
          success: false,
          error: `Location "${city}" not found. Try another city name.`,
        });
      }
      const primary = searchResults[0];
      lat = primary.latitude;
      lon = primary.longitude;
      locationName = `${primary.name}${primary.admin1 ? ', ' + primary.admin1 : ''}${primary.country ? ', ' + primary.country : ''}`;
      if (!timezone) timezone = primary.timezone;
    } else {
      lat = parseFloat(lat);
      lon = parseFloat(lon);
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ success: false, error: 'Invalid latitude or longitude numbers.' });
      }
      if (!locationName) {
        locationName = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      }
    }

    const data = await fetchWeatherData(lat, lon, timezone, locationName);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
