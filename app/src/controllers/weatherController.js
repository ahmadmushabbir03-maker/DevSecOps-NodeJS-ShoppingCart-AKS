const WeatherService = require('../services/weatherService');

exports.renderDashboard = async (req, res) => {
  const city = req.query.city || 'London';

  try {
    const weatherData = await WeatherService.getWeatherByCity(city);
    res.render('pages/index', {
      weather: weatherData,
      error: null,
      searchCity: city
    });
  } catch (error) {
    res.render('pages/index', {
      weather: null,
      error: error.message,
      searchCity: city
    });
  }
};
