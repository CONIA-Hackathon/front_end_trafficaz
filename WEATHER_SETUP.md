# Weather API Setup Guide

## Fixing the 401 Unauthorized Error

The weather feature is currently showing a 401 error because the OpenWeather API key is not configured. Follow these steps to fix it:

### Step 1: Get a Free OpenWeather API Key

1. Go to [OpenWeather API](https://openweathermap.org/api)
2. Click "Sign Up" or "Sign In" if you already have an account
3. After signing in, go to your dashboard
4. Navigate to "API keys" section
5. Copy your API key (it looks like: `1234567890abcdef1234567890abcdef`)

### Step 2: Configure the API Key

1. Open `config/weather.js`
2. Replace `'YOUR_OPENWEATHER_API_KEY_HERE'` with your actual API key:

```javascript
export const WEATHER_CONFIG = {
  API_KEY: 'your_actual_api_key_here', // Replace this
  // ... rest of config
};
```

### Step 3: Test the Weather Feature

1. Restart your development server
2. Navigate to the weather screen
3. The weather data should now load properly

### Free Tier Limits

- **1000 API calls per day** (sufficient for development and testing)
- **Current weather data**
- **5-day forecast**
- **No credit card required**

### Troubleshooting

If you still get errors:

1. **Check API key format**: Should be 32 characters long
2. **Wait for activation**: New API keys may take a few hours to activate
3. **Check usage limits**: Ensure you haven't exceeded the daily limit
4. **Verify location**: The app uses Yaoundé, Cameroon as default location

### Fallback Mode

If the API key is not configured, the app will use mock weather data to ensure the UI works properly. You'll see a warning in the console: `⚠️ OpenWeather API key not configured. Using mock data.`

### Security Note

- Never commit your API key to version control
- Consider using environment variables for production
- The free tier is sufficient for development and small-scale use 