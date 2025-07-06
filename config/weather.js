// OpenWeather API Configuration
// Get your free API key from: https://openweathermap.org/api

export const WEATHER_CONFIG = {
  // Replace with your OpenWeather API key
  API_KEY: 'ee3c20074157f394edd999aeb8af0afa',

  // API_KEY: '140277fea3533f3cfb42e59df81e2f9c',
  
  // Default location (Yaoundé, Cameroon)
  DEFAULT_LOCATION: {
    latitude: 3.848033,
    longitude: 11.502075,
    city: 'Yaoundé'
  },
  
  // Cache settings
  CACHE_TIMEOUT: 10 * 60 * 1000, // 10 minutes
  
  // API endpoints
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  
  // Units (metric for Celsius)
  UNITS: 'metric',
  
  // Language
  LANGUAGE: 'en'
};

// Instructions for getting API key:
// 1. Go to https://openweathermap.org/api
// 2. Sign up for a free account
// 3. Get your API key from the dashboard
// 4. Replace 'YOUR_OPENWEATHER_API_KEY_HERE' with your actual API key
// 5. The free tier allows 1000 calls per day, which is sufficient for testing 