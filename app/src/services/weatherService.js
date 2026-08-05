const axios = require('axios');

class WeatherService {
  static async getWeatherByCity(city) {
    const geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    const weatherUrl = 'https://api.open-meteo.com/v1/forecast';

    try {
      // Step 1: Geocode city name to coordinates
      const geoResponse = await axios.get(geocodingUrl, {
        params: { name: city, count: 1, language: 'en', format: 'json' },
        timeout: 5000
      });

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        throw new Error(`City "${city}" not found. Please verify the spelling and try again.`);
      }

      const location = geoResponse.data.results[0];
      const { latitude, longitude, name, country } = location;

      // Step 2: Fetch weather metrics using coordinates
      const weatherResponse = await axios.get(weatherUrl, {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,surface_pressure,wind_speed_10m,weather_code',
          hourly: 'visibility',
          timezone: 'auto'
        },
        timeout: 5000
      });

      const current = weatherResponse.data.current;
      const hourly = weatherResponse.data.hourly;

      const condition = WeatherService.mapWMOCode(current.weather_code);
      const visibility = hourly && hourly.visibility ? (hourly.visibility[0] / 1000).toFixed(1) : '10.0';

      return {
        city: name,
        country: country || '',
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        tempMin: Math.round(current.temperature_2m - 2),
        tempMax: Math.round(current.temperature_2m + 2),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m.toFixed(1),
        pressure: Math.round(current.surface_pressure),
        visibility: visibility,
        description: condition.description,
        mainCondition: condition.main,
        icon: condition.icon,
        isNight: current.is_day === 0,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } catch (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Network connection failed. Please check your internet connection.');
      }
      if (error.message.includes('not found')) {
        throw error;
      }
      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  }

  static mapWMOCode(code) {
    switch (code) {
      case 0:
        return { main: 'Clear', description: 'clear sky', icon: '01d' };
      case 1:
      case 2:
      case 3:
        return { main: 'Clouds', description: 'partly cloudy', icon: '02d' };
      case 45:
      case 48:
        return { main: 'Clouds', description: 'foggy', icon: '50d' };
      case 51:
      case 53:
      case 55:
      case 61:
      case 63:
      case 65:
        return { main: 'Rain', description: 'rainy', icon: '10d' };
      case 71:
      case 73:
      case 75:
      case 77:
        return { main: 'Snow', description: 'snowing', icon: '13d' };
      case 80:
      case 81:
      case 82:
        return { main: 'Rain', description: 'heavy rain showers', icon: '09d' };
      case 95:
      case 96:
      case 99:
        return { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' };
      default:
        return { main: 'Clear', description: 'clear conditions', icon: '01d' };
    }
  }
}

module.exports = WeatherService;
