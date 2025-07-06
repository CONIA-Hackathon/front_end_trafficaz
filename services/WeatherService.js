import * as Location from 'expo-location';

class WeatherService {
  constructor() {
    this.apiKey = '140277fea3533f3cfb42e59df81e2f9c'; // Replace with your API key
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 
  }

  // Set API key
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  // Get current weather for a location
  async getCurrentWeather(latitude, longitude) {
    const cacheKey = `current_${latitude}_${longitude}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric&lang=en`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      const weatherData = this.formatCurrentWeather(data);
      
      this.cacheData(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return this.getDefaultWeatherData();
    }
  }

  // Get weather forecast for a location
  async getWeatherForecast(latitude, longitude) {
    const cacheKey = `forecast_${latitude}_${longitude}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric&lang=en`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      const forecastData = this.formatForecast(data);
      
      this.cacheData(cacheKey, forecastData);
      return forecastData;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return this.getDefaultForecastData();
    }
  }

  // Get weather for user's current location
  async getCurrentLocationWeather() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      
      const [currentWeather, forecast] = await Promise.all([
        this.getCurrentWeather(latitude, longitude),
        this.getWeatherForecast(latitude, longitude)
      ]);

      return {
        current: currentWeather,
        forecast: forecast,
        location: { latitude, longitude }
      };
    } catch (error) {
      console.error('Error getting location weather:', error);
      return {
        current: this.getDefaultWeatherData(),
        forecast: this.getDefaultForecastData(),
        location: null
      };
    }
  }

  // Format current weather data
  formatCurrentWeather(data) {
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: data.wind.deg,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      main: data.weather[0].main,
      visibility: data.visibility / 1000, // Convert to km
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timestamp: new Date(),
      trafficImpact: this.calculateTrafficImpact(data),
      recommendations: this.generateWeatherRecommendations(data)
    };
  }

  // Format forecast data
  formatForecast(data) {
    const hourlyForecast = data.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000),
      temperature: Math.round(item.main.temp),
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      main: item.weather[0].main,
      windSpeed: Math.round(item.wind.speed * 3.6),
      rainChance: item.pop * 100, // Probability of precipitation
      trafficImpact: this.calculateTrafficImpact(item)
    }));

    return {
      hourly: hourlyForecast,
      daily: this.groupForecastByDay(data.list),
      summary: this.generateForecastSummary(hourlyForecast)
    };
  }

  // Group forecast by day
  groupForecastByDay(forecastList) {
    const dailyForecast = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyForecast[date]) {
        dailyForecast[date] = [];
      }
      dailyForecast[date].push(item);
    });

    return Object.keys(dailyForecast).map(date => {
      const dayData = dailyForecast[date];
      const avgTemp = Math.round(
        dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length
      );
      const maxTemp = Math.round(Math.max(...dayData.map(item => item.main.temp)));
      const minTemp = Math.round(Math.min(...dayData.map(item => item.main.temp)));
      
      return {
        date: new Date(date),
        avgTemperature: avgTemp,
        maxTemperature: maxTemp,
        minTemperature: minTemp,
        description: dayData[0].weather[0].description,
        icon: dayData[0].weather[0].icon,
        rainChance: Math.max(...dayData.map(item => item.pop * 100)),
        trafficImpact: this.calculateTrafficImpact(dayData[0])
      };
    });
  }

  // Calculate traffic impact based on weather
  calculateTrafficImpact(weatherData) {
    const { main, wind, visibility, rainChance } = weatherData;
    let impact = 'low';
    let reasons = [];

    // Rain impact
    if (main === 'Rain' || main === 'Thunderstorm' || (rainChance && rainChance > 60)) {
      impact = 'high';
      reasons.push('Rain reduces visibility and road grip');
    }

    // Heavy rain
    if (main === 'Thunderstorm' || (rainChance && rainChance > 80)) {
      impact = 'very_high';
      reasons.push('Heavy rain may cause flooding');
    }

    // Wind impact
    if (wind && wind.speed > 20) {
      impact = impact === 'low' ? 'medium' : impact;
      reasons.push('Strong winds affect driving stability');
    }

    // Visibility impact
    if (visibility && visibility < 5) {
      impact = impact === 'low' ? 'medium' : impact;
      reasons.push('Low visibility conditions');
    }

    // Fog impact
    if (main === 'Mist' || main === 'Fog') {
      impact = 'high';
      reasons.push('Fog significantly reduces visibility');
    }

    return {
      level: impact,
      reasons: reasons,
      delayMinutes: this.calculateDelayMinutes(impact)
    };
  }

  // Calculate expected delay based on impact
  calculateDelayMinutes(impact) {
    switch (impact) {
      case 'very_high': return 30;
      case 'high': return 20;
      case 'medium': return 10;
      case 'low': return 5;
      default: return 0;
    }
  }

  // Generate weather recommendations
  generateWeatherRecommendations(weatherData) {
    const recommendations = [];
    const { main, wind, visibility, trafficImpact } = weatherData;

    if (trafficImpact.level === 'very_high') {
      recommendations.push('Leave 30 minutes earlier than usual');
      recommendations.push('Consider taking public transport');
      recommendations.push('Avoid flood-prone areas');
    } else if (trafficImpact.level === 'high') {
      recommendations.push('Leave 15-20 minutes earlier');
      recommendations.push('Drive with extra caution');
      recommendations.push('Use windshield wipers and lights');
    } else if (trafficImpact.level === 'medium') {
      recommendations.push('Leave 10 minutes earlier');
      recommendations.push('Maintain safe following distance');
    }

    if (main === 'Thunderstorm') {
      recommendations.push('Avoid driving during thunderstorms');
    }

    if (visibility && visibility < 3) {
      recommendations.push('Use fog lights and reduce speed');
    }

    if (wind && wind.speed > 25) {
      recommendations.push('Be aware of wind gusts');
    }

    return recommendations;
  }

  // Generate forecast summary
  generateForecastSummary(hourlyForecast) {
    const rainHours = hourlyForecast.filter(h => h.rainChance > 50).length;
    const avgTemp = Math.round(
      hourlyForecast.reduce((sum, h) => sum + h.temperature, 0) / hourlyForecast.length
    );

    let summary = `Today's weather: ${avgTemp}°C average`;
    
    if (rainHours > 0) {
      summary += `, ${rainHours} hours of rain expected`;
    }

    const maxImpact = hourlyForecast.reduce((max, h) => 
      this.getImpactLevel(h.trafficImpact.level) > this.getImpactLevel(max) ? h.trafficImpact : max
    );

    if (maxImpact.level !== 'low') {
      summary += `. Traffic impact: ${maxImpact.level.replace('_', ' ')}`;
    }

    return summary;
  }

  // Get impact level for comparison
  getImpactLevel(level) {
    const levels = { 'low': 1, 'medium': 2, 'high': 3, 'very_high': 4 };
    return levels[level] || 1;
  }

  // Cache management
  cacheData(key, data) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }

  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Default weather data for fallback
  getDefaultWeatherData() {
    return {
      temperature: 25,
      feelsLike: 27,
      humidity: 70,
      pressure: 1013,
      windSpeed: 10,
      windDirection: 180,
      description: 'Partly cloudy',
      icon: '02d',
      main: 'Clouds',
      visibility: 10,
      sunrise: new Date(),
      sunset: new Date(),
      timestamp: new Date(),
      trafficImpact: { level: 'low', reasons: [], delayMinutes: 0 },
      recommendations: []
    };
  }

  // Default forecast data for fallback
  getDefaultForecastData() {
    return {
      hourly: [],
      daily: [],
      summary: 'Weather data unavailable'
    };
  }

  // Get weather icon based on condition
  getWeatherIcon(iconCode) {
    const iconMap = {
      '01d': '☀️', // Clear sky day
      '01n': '🌙', // Clear sky night
      '02d': '⛅', // Few clouds day
      '02n': '☁️', // Few clouds night
      '03d': '☁️', // Scattered clouds
      '03n': '☁️',
      '04d': '☁️', // Broken clouds
      '04n': '☁️',
      '09d': '🌧️', // Shower rain
      '09n': '🌧️',
      '10d': '🌦️', // Rain day
      '10n': '🌧️', // Rain night
      '11d': '⛈️', // Thunderstorm
      '11n': '⛈️',
      '13d': '🌨️', // Snow
      '13n': '🌨️',
      '50d': '🌫️', // Mist
      '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  }

  // Get weather color based on condition
  getWeatherColor(iconCode) {
    const colorMap = {
      '01d': '#FFD700', // Sunny - Gold
      '01n': '#1E3A8A', // Clear night - Dark blue
      '02d': '#87CEEB', // Partly cloudy - Sky blue
      '02n': '#4B5563', // Cloudy night - Gray
      '03d': '#9CA3AF', // Cloudy - Light gray
      '03n': '#6B7280',
      '04d': '#6B7280', // Overcast - Gray
      '04n': '#4B5563',
      '09d': '#3B82F6', // Rain - Blue
      '09n': '#1E40AF',
      '10d': '#2563EB', // Heavy rain - Dark blue
      '10n': '#1E3A8A',
      '11d': '#7C3AED', // Storm - Purple
      '11n': '#5B21B6',
      '13d': '#E5E7EB', // Snow - White
      '13n': '#D1D5DB',
      '50d': '#9CA3AF', // Mist - Gray
      '50n': '#6B7280'
    };
    return colorMap[iconCode] || '#6B7280';
  }
}

// Create singleton instance
const weatherService = new WeatherService();

export default weatherService; 