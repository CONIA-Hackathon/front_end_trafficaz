import * as Speech from 'expo-speech';
import * as Location from 'expo-location';

class VoiceActivationService {
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
    
    this.initializeCommands();
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

    // Emergency commands
    this.commands.set('emergency', {
      patterns: ['emergency', 'accident', 'road blocked'],
      handler: this.handleEmergency.bind(this)
    });
  }

  // Start voice activation service
  async start() {
    if (this.isActive) return;

    try {
      // Request microphone permission
      const { status } = await this.requestMicrophonePermission();
      if (status !== 'granted') {
        throw new Error('Microphone permission denied');
      }

      this.isActive = true;
      this.startListening();
      
      console.log('🎤 Voice activation service started');
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
    
    console.log('🎤 Voice activation service stopped');
    this.speakFeedback('Voice activation disabled.');
  }

  // Request microphone permission
  async requestMicrophonePermission() {
    // In a real implementation, you would use expo-av or similar
    // For now, we'll simulate permission
    return { status: 'granted' };
  }

  // Start listening for wake word
  startListening() {
    if (!this.isActive || this.isListening) return;

    this.isListening = true;
    console.log('🎤 Listening for wake word:', this.wakeWord);
    
    // In a real implementation, this would start actual voice recognition
    // For demo purposes, we'll simulate wake word detection
    this.simulateWakeWordDetection();
  }

  // Stop listening
  stopListening() {
    this.isListening = false;
    console.log('🎤 Stopped listening');
  }

  // Simulate wake word detection (for demo)
  simulateWakeWordDetection() {
    if (!this.isActive) return;

    // Simulate wake word detection after 5 seconds
    setTimeout(() => {
      if (this.isActive) {
        this.onWakeWordDetected();
      }
    }, 5000);
  }

  // Handle wake word detection
  onWakeWordDetected() {
    console.log('🎤 Wake word detected!');
    
    if (this.onWakeWordCallback) {
      this.onWakeWordCallback();
    }

    this.speakFeedback('I\'m listening. How can I help you with traffic?');
    this.startCommandListening();
  }

  // Start listening for commands
  startCommandListening() {
    console.log('🎤 Listening for commands...');
    
    // Simulate command detection after 3 seconds
    setTimeout(() => {
      if (this.isActive) {
        // Simulate different commands for demo
        const demoCommands = [
          'what is the traffic situation between my current location and melen',
          'report traffic in my area',
          'check my traffic alerts',
          'open the traffic map',
          'how is traffic on my route to work'
        ];
        
        const randomCommand = demoCommands[Math.floor(Math.random() * demoCommands.length)];
        this.processCommand(randomCommand);
      }
    }, 3000);
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

    // Resume listening after command processing
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
      
      // Simulate traffic analysis
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
      
      // Simulate traffic reporting
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
    
    // Simulate route traffic check
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
    
    // Simulate emergency alert
    setTimeout(() => {
      this.speakFeedback('Emergency alert sent. Please proceed with caution and follow traffic instructions.');
    }, 1000);
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
}

// Create singleton instance
const voiceActivationService = new VoiceActivationService();

export default voiceActivationService; 