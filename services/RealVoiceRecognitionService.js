import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';

class RealVoiceRecognitionService {
  constructor() {
    this.isActive = false;
    this.isListening = false;
    this.wakeWord = 'hey trafficaz';
    this.commands = new Map();
    this.onCommandCallback = null;
    this.onWakeWordCallback = null;
    this.voiceSettings = {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.8,
      voice: null
    };
    
    this.initializeVoice();
    this.initializeCommands();
  }

  initializeVoice() {
    // Set up voice recognition event listeners
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
  }

  initializeCommands() {
    // Traffic queries
    this.commands.set('traffic_situation', {
      patterns: ['traffic situation', 'traffic condition', 'how is traffic'],
      handler: this.handleTrafficQuery.bind(this)
    });

    // Traffic reporting
    this.commands.set('report_traffic', {
      patterns: ['report traffic', 'traffic report', 'report congestion'],
      handler: this.handleReportTraffic.bind(this)
    });

    // Check alerts
    this.commands.set('check_alerts', {
      patterns: ['check alerts', 'alerts', 'notifications', 'traffic alerts'],
      handler: this.handleCheckAlerts.bind(this)
    });

    // Navigation commands
    this.commands.set('open_map', {
      patterns: ['open map', 'show map', 'navigation', 'map'],
      handler: this.handleOpenMap.bind(this)
    });

    // Route queries
    this.commands.set('route_traffic', {
      patterns: ['route traffic', 'my route', 'commute traffic'],
      handler: this.handleRouteTraffic.bind(this)
    });

    // Weather commands
    this.commands.set('weather_info', {
      patterns: ['weather', 'weather condition', 'temperature', 'how is the weather'],
      handler: this.handleWeatherQuery.bind(this)
    });

    this.commands.set('weather_traffic', {
      patterns: ['weather affecting traffic', 'weather impact', 'traffic weather'],
      handler: this.handleWeatherTrafficQuery.bind(this)
    });

    this.commands.set('weather_forecast', {
      patterns: ['weather forecast', 'weather prediction', 'will it rain'],
      handler: this.handleWeatherForecast.bind(this)
    });

    // Emergency commands
    this.commands.set('emergency', {
      patterns: ['emergency', 'accident', 'road blocked'],
      handler: this.handleEmergency.bind(this)
    });
  }

  // Start voice activation service
  async start() {
    if (this.isActive) return true;

    try {
      this.isActive = true;
      this.startListening();
      
      console.log('🎤 Real voice activation service started');
      this.speakFeedback('Voice activation enabled. Say "Hey TrafficAZ" to activate.');
      
      return true;
    } catch (error) {
      console.error('Failed to start voice activation:', error);
      this.speakFeedback('Failed to start voice activation. Please check microphone permissions.');
      return false;
    }
  }

  // Stop voice activation service
  stop() {
    this.isActive = false;
    this.isListening = false;
    this.stopListening();
    
    console.log('🎤 Real voice activation service stopped');
    this.speakFeedback('Voice activation disabled.');
  }

  // Start listening for wake word
  startListening() {
    if (!this.isActive || this.isListening) return;

    try {
      this.isListening = true;
      Voice.start('en-US');
      console.log('🎤 Started listening for wake word:', this.wakeWord);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      this.isListening = false;
    }
  }

  // Stop listening
  stopListening() {
    if (this.isListening) {
      try {
        Voice.stop();
        this.isListening = false;
        console.log('🎤 Stopped listening');
      } catch (error) {
        console.error('Error stopping voice recognition:', error);
      }
    }
  }

  // Voice recognition event handlers
  onSpeechStart() {
    console.log('🎤 Speech started');
  }

  onSpeechEnd() {
    console.log('🎤 Speech ended');
    // Restart listening after a short delay
    setTimeout(() => {
      if (this.isActive && !this.isListening) {
        this.startListening();
      }
    }, 1000);
  }

  onSpeechResults(event) {
    const results = event.value;
    console.log('🎤 Speech results:', results);

    if (results && results.length > 0) {
      const spokenText = results[0].toLowerCase();
      this.processSpokenText(spokenText);
    }
  }

  onSpeechPartialResults(event) {
    const results = event.value;
    if (results && results.length > 0) {
      const spokenText = results[0].toLowerCase();
      console.log('🎤 Partial results:', spokenText);
      
      // Check for wake word in partial results
      if (spokenText.includes(this.wakeWord)) {
        this.onWakeWordDetected();
      }
    }
  }

  onSpeechError(event) {
    console.error('🎤 Speech recognition error:', event.error);
    
    // Restart listening on error
    setTimeout(() => {
      if (this.isActive) {
        this.startListening();
      }
    }, 2000);
  }

  // Process spoken text
  processSpokenText(text) {
    console.log('🎤 Processing spoken text:', text);
    
    // Check if wake word is present
    if (text.includes(this.wakeWord)) {
      this.onWakeWordDetected();
      return;
    }

    // If wake word was already detected, process as command
    if (this.wakeWordDetected) {
      this.processCommand(text);
    }
  }

  // Handle wake word detection
  onWakeWordDetected() {
    console.log('🎤 Wake word detected!');
    this.wakeWordDetected = true;
    
    if (this.onWakeWordCallback) {
      this.onWakeWordCallback();
    }

    this.speakFeedback('I\'m listening. How can I help you with traffic?');
  }

  // Process voice command
  async processCommand(command) {
    console.log('🎤 Processing command:', command);
    
    const lowerCommand = command.toLowerCase();
    let commandHandled = false;

    // Check each command pattern
    for (const [commandKey, commandData] of this.commands) {
      for (const pattern of commandData.patterns) {
        if (lowerCommand.includes(pattern)) {
          try {
            await commandData.handler(command);
            commandHandled = true;
            break;
          } catch (error) {
            console.error(`Error handling command ${commandKey}:`, error);
          }
        }
      }
      if (commandHandled) break;
    }

    if (!commandHandled) {
      this.speakFeedback('I didn\'t understand that command. Try asking about traffic, reporting traffic, or checking alerts.');
    }

    // Reset wake word detection and resume listening
    this.wakeWordDetected = false;
    setTimeout(() => {
      if (this.isActive) {
        this.startListening();
      }
    }, 2000);
  }

  // Command handlers
  async handleTrafficQuery(command) {
    const destination = this.extractDestination(command);
    
    this.speakFeedback(`Checking traffic to ${destination}. Please wait.`);
    
    try {
      const location = await this.getCurrentLocation();
      
      // Simulate traffic analysis (replace with real API call)
      setTimeout(() => {
        const trafficLevel = Math.random() > 0.5 ? 'moderate' : 'heavy';
        const eta = Math.floor(Math.random() * 30) + 10;
        const alternative = Math.random() > 0.5 ? 'Consider taking Avenue Kennedy instead.' : '';
        
        this.speakFeedback(`Traffic to ${destination} is ${trafficLevel}. Estimated travel time is ${eta} minutes. ${alternative}`);
      }, 2000);
      
    } catch (error) {
      this.speakFeedback('Sorry, I couldn\'t check the traffic right now. Please try again.');
    }
  }

  async handleReportTraffic(command) {
    this.speakFeedback('Reporting traffic in your area. Please confirm.');
    
    try {
      const location = await this.getCurrentLocation();
      
      // Simulate traffic reporting (replace with real API call)
      setTimeout(() => {
        const usersNotified = Math.floor(Math.random() * 50) + 10;
        this.speakFeedback(`Traffic reported successfully. ${usersNotified} nearby users have been notified. Thank you for helping the community.`);
      }, 1500);
      
    } catch (error) {
      this.speakFeedback('Sorry, I couldn\'t report traffic right now. Please try again.');
    }
  }

  async handleCheckAlerts(command) {
    const alertCount = Math.floor(Math.random() * 5) + 1;
    const priority = Math.random() > 0.5 ? 'high' : 'medium';
    
    this.speakFeedback(`You have ${alertCount} traffic alert${alertCount > 1 ? 's' : ''}. ${alertCount > 1 ? 'The most recent is' : 'It\'s'} a ${priority} priority alert about heavy traffic on Main Street.`);
  }

  async handleOpenMap(command) {
    this.speakFeedback('Opening the traffic map for you.');
    
    if (this.onCommandCallback) {
      this.onCommandCallback('navigate', { screen: 'Map' });
    }
  }

  async handleRouteTraffic(command) {
    this.speakFeedback('Checking traffic on your scheduled routes.');
    
    // Simulate route traffic check (replace with real API call)
    setTimeout(() => {
      const routes = ['Home to Work', 'Work to Home'];
      const route = routes[Math.floor(Math.random() * routes.length)];
      const trafficLevel = Math.random() > 0.5 ? 'moderate' : 'heavy';
      const eta = Math.floor(Math.random() * 20) + 10;
      
      this.speakFeedback(`Your ${route} route has ${trafficLevel} traffic. Estimated travel time is ${eta} minutes.`);
    }, 1500);
  }

  async handleEmergency(command) {
    this.speakFeedback('Emergency traffic situation detected. Sending alert to all nearby users and emergency services.');
    
    // Simulate emergency alert (replace with real API call)
    setTimeout(() => {
      this.speakFeedback('Emergency alert sent. Please proceed with caution and follow traffic instructions.');
    }, 1000);
  }

  async handleWeatherQuery(command) {
    try {
      this.speakFeedback('Checking current weather conditions. Please wait.');
      
      const location = await this.getCurrentLocation();
      const weatherData = await weatherService.getCurrentWeather(location.coords.latitude, location.coords.longitude);
      
      const weatherDescription = weatherData.description;
      const temperature = weatherData.temperature;
      const humidity = weatherData.humidity;
      
      this.speakFeedback(`Current weather: ${weatherDescription}. Temperature is ${temperature} degrees Celsius. Humidity is ${humidity} percent.`);
      
    } catch (error) {
      console.error('Error processing weather query:', error);
      this.speakFeedback('Sorry, I couldn\'t check the weather right now. Please try again.');
    }
  }

  async handleWeatherTrafficQuery(command) {
    try {
      this.speakFeedback('Checking how weather is affecting traffic. Please wait.');
      
      const location = await this.getCurrentLocation();
      const weatherData = await weatherService.getCurrentWeather(location.coords.latitude, location.coords.longitude);
      
      const trafficImpact = weatherData.trafficImpact;
      const impactLevel = trafficImpact.level;
      const delayMinutes = trafficImpact.delayMinutes;
      
      if (impactLevel === 'low') {
        this.speakFeedback('Weather conditions are good. Traffic should be normal with minimal delays.');
      } else if (impactLevel === 'medium') {
        this.speakFeedback(`Weather is moderately affecting traffic. Expect delays of about ${delayMinutes} minutes. Drive with caution.`);
      } else if (impactLevel === 'high') {
        this.speakFeedback(`Weather is significantly affecting traffic. Expect delays of about ${delayMinutes} minutes. Consider leaving earlier.`);
      } else {
        this.speakFeedback(`Weather is severely affecting traffic. Expect delays of about ${delayMinutes} minutes. Consider alternative routes or public transport.`);
      }
      
    } catch (error) {
      console.error('Error processing weather traffic query:', error);
      this.speakFeedback('Sorry, I couldn\'t check weather traffic impact right now. Please try again.');
    }
  }

  async handleWeatherForecast(command) {
    try {
      this.speakFeedback('Checking weather forecast. Please wait.');
      
      const location = await this.getCurrentLocation();
      const forecastData = await weatherService.getWeatherForecast(location.coords.latitude, location.coords.longitude);
      
      if (forecastData.hourly && forecastData.hourly.length > 0) {
        const nextFewHours = forecastData.hourly.slice(0, 4);
        let forecastSummary = 'Weather forecast for the next few hours: ';
        
        nextFewHours.forEach((hour, index) => {
          const time = hour.time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          const temp = hour.temperature;
          const description = hour.description;
          const rainChance = hour.rainChance;
          
          forecastSummary += `${time}: ${description}, ${temp} degrees`;
          if (rainChance > 30) {
            forecastSummary += `, ${Math.round(rainChance)}% chance of rain`;
          }
          forecastSummary += '. ';
        });
        
        this.speakFeedback(forecastSummary);
      } else {
        this.speakFeedback('Weather forecast data is currently unavailable.');
      }
      
    } catch (error) {
      console.error('Error processing weather forecast:', error);
      this.speakFeedback('Sorry, I couldn\'t check the weather forecast right now. Please try again.');
    }
  }

  // Extract destination from command
  extractDestination(command) {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('melen')) return 'Melen';
    if (lowerCommand.includes('yaounde') || lowerCommand.includes('yaoundé')) return 'Yaoundé';
    if (lowerCommand.includes('school') || lowerCommand.includes('university')) return 'University';
    if (lowerCommand.includes('work') || lowerCommand.includes('office')) return 'Work';
    if (lowerCommand.includes('home')) return 'Home';
    if (lowerCommand.includes('market')) return 'Market';
    if (lowerCommand.includes('airport')) return 'Airport';
    if (lowerCommand.includes('hospital')) return 'Hospital';
    
    return 'your destination';
  }

  // Get current location
  async getCurrentLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  }

  // Speak feedback to user
  speakFeedback(text) {
    Speech.speak(text, {
      language: this.voiceSettings.language,
      pitch: this.voiceSettings.pitch,
      rate: this.voiceSettings.rate,
      voice: this.voiceSettings.voice,
      onDone: () => {
        console.log('🗣️ Voice feedback completed:', text);
      },
      onError: (error) => {
        console.error('Speech error:', error);
      }
    });
  }

  // Set voice settings
  setVoiceSettings(settings) {
    this.voiceSettings = { ...this.voiceSettings, ...settings };
  }

  // Set callbacks
  setOnCommandCallback(callback) {
    this.onCommandCallback = callback;
  }

  setOnWakeWordCallback(callback) {
    this.onWakeWordCallback = callback;
  }

  // Get service status
  getStatus() {
    return {
      isActive: this.isActive,
      isListening: this.isListening,
      wakeWord: this.wakeWord
    };
  }

  // Test voice activation
  testVoiceActivation() {
    if (!this.isActive) {
      this.speakFeedback('Voice activation is not enabled. Please enable it first.');
      return;
    }

    this.onWakeWordDetected();
  }

  // Cleanup
  destroy() {
    this.stop();
    Voice.destroy().then(Voice.removeAllListeners);
  }
}

// Create singleton instance
const realVoiceRecognitionService = new RealVoiceRecognitionService();

export default realVoiceRecognitionService; 