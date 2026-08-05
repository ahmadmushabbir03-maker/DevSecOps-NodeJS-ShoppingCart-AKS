const express = require('express');
const path = require('path');
require('dotenv').config();

const weatherRoutes = require('./src/routes/weatherRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Routes
app.use('/', weatherRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('pages/index', {
    weather: null,
    error: 'Page Not Found',
    searchCity: ''
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
