import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const trafficDots = useRef(Array(6).fill(0).map(() => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startAnimations = async () => {
      // Initial fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Logo scale animation
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Background scale animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Traffic dots animation - circular paths
      const dotAnimations = trafficDots.map((dot, index) => {
        return Animated.loop(
          Animated.timing(dot, {
            toValue: 1,
            duration: 3000 + index * 500,
            delay: index * 200,
            useNativeDriver: true,
          })
        );
      });

      Animated.parallel(dotAnimations).start();

      // Pulsing effect for the map icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Auto navigate after animations
      setTimeout(() => {
        onFinish();
      }, 3000);
    };

    startAnimations();
  }, []);

  const renderTrafficDot = (index) => {
    // Create circular paths for each dot
    const radius = 80 + index * 20;
    
    // Calculate the circular motion using sin and cos
    const translateX = trafficDots[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 2 * Math.PI],
    });

    const translateY = trafficDots[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 2 * Math.PI],
    });

    const x = translateX.interpolate({
      inputRange: [0, 2 * Math.PI],
      outputRange: [0, radius * 2 * Math.PI],
    });

    const y = translateY.interpolate({
      inputRange: [0, 2 * Math.PI],
      outputRange: [0, radius * 2 * Math.PI],
    });

    const opacity = trafficDots[index].interpolate({
      inputRange: [0, 0.3, 0.7, 1],
      outputRange: [0, 1, 1, 0],
    });

    const scale = trafficDots[index].interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.5, 1, 0.5],
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.trafficDot,
          {
            position: 'absolute',
            left: width / 2 - 6, // Center the dot (half of dot width)
            top: height / 2 - 100 - 6, // Center around logo area (half of dot height)
            transform: [
              { translateX: x },
              { translateY: y },
              { scale }
            ],
            opacity,
            backgroundColor: index % 2 === 0 ? '#FF6B6B' : '#4ECDC4',
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.background}
      >
        {/* Traffic dots animation */}
        {trafficDots.map((_, index) => renderTrafficDot(index))}

        {/* Main content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Map icon with pulse animation */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Ionicons name="map" size={80} color="#4ECDC4" />
            <View style={styles.iconGlow} />
          </Animated.View>

          {/* App name */}
          <Text style={styles.appName}>TrafficAZ</Text>
          
          {/* Tagline */}
          <Text style={styles.tagline}>Smart Traffic Navigation</Text>

          {/* Loading indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingDots}>
              {[0, 1, 2].map((index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.loadingDot,
                    {
                      opacity: fadeAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, 1, 0.8],
                      }),
                      transform: [
                        {
                          scale: fadeAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0.5, 1, 0.8],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  iconGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderRadius: 50,
    zIndex: -1,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#4ECDC4',
    marginBottom: 60,
    letterSpacing: 1,
    opacity: 0.9,
  },
  loadingContainer: {
    marginTop: 40,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
    marginHorizontal: 4,
  },
  trafficDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SplashScreen; 