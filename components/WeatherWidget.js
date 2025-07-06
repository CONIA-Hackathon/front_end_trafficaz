import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../constants/colors';
import weatherService from '../services/WeatherService';

const WeatherWidget = ({ onPress, compact = false }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await weatherService.getCurrentLocationWeather();
      setWeatherData(data);
    } catch (error) {
      console.error('Error loading weather data:', error);
      setError('Unable to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const getTrafficImpactColor = (level) => {
    switch (level) {
      case 'very_high': return colors.danger;
      case 'high': return colors.warning;
      case 'medium': return colors.info;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getTrafficImpactIcon = (level) => {
    switch (level) {
      case 'very_high': return 'alert-circle';
      case 'high': return 'warning';
      case 'medium': return 'information-circle';
      case 'low': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  const getTrafficImpactText = (level) => {
    switch (level) {
      case 'very_high': return 'VERY HIGH';
      case 'high': return 'HIGH';
      case 'medium': return 'MEDIUM';
      case 'low': return 'LOW';
      default: return 'UNKNOWN';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, compact && styles.containerCompact]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading weather...</Text>
        </View>
      </View>
    );
  }

  if (error || !weatherData?.current) {
    return (
      <View style={[styles.container, compact && styles.containerCompact]}>
        <TouchableOpacity onPress={loadWeatherData} style={styles.errorContainer}>
          <Ionicons name="refresh" size={20} color={colors.textSecondary} />
          <Text style={styles.errorText}>Tap to refresh weather</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { current, forecast } = weatherData;
  const weatherIcon = weatherService.getWeatherIcon(current.icon);
  const weatherColor = weatherService.getWeatherColor(current.icon);
  const trafficImpact = current.trafficImpact;

  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.containerCompact}>
        <LinearGradient
          colors={[weatherColor + '20', weatherColor + '10']}
          style={styles.compactGradient}
        >
          <View style={styles.compactContent}>
            <View style={styles.compactWeather}>
              <Text style={styles.compactIcon}>{weatherIcon}</Text>
              <View style={styles.compactTemp}>
                <Text style={styles.compactTempText}>{current.temperature}°</Text>
                <Text style={styles.compactDescription}>{current.description}</Text>
              </View>
            </View>
            
            <View style={styles.compactTraffic}>
              <Ionicons 
                name={getTrafficImpactIcon(trafficImpact.level)} 
                size={16} 
                color={getTrafficImpactColor(trafficImpact.level)} 
              />
              <Text style={[styles.compactTrafficText, { color: getTrafficImpactColor(trafficImpact.level) }]}>
                {getTrafficImpactText(trafficImpact.level)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={[weatherColor + '30', weatherColor + '15']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={colors.textSecondary} />
            <Text style={styles.locationText}>Yaoundé</Text>
          </View>
          <TouchableOpacity onPress={loadWeatherData} style={styles.refreshButton}>
            <Ionicons name="refresh" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Main Weather Info */}
        <View style={styles.mainWeather}>
          <View style={styles.weatherLeft}>
            <Text style={styles.weatherIcon}>{weatherIcon}</Text>
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>{current.temperature}°</Text>
              <Text style={styles.feelsLike}>Feels like {current.feelsLike}°</Text>
            </View>
          </View>
          
          <View style={styles.weatherRight}>
            <Text style={styles.description}>{current.description}</Text>
            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Ionicons name="water" size={14} color={colors.textSecondary} />
                <Text style={styles.detailText}>{current.humidity}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="speedometer" size={14} color={colors.textSecondary} />
                <Text style={styles.detailText}>{current.windSpeed} km/h</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Traffic Impact */}
        <View style={styles.trafficImpact}>
          <View style={styles.trafficHeader}>
            <Ionicons 
              name={getTrafficImpactIcon(trafficImpact.level)} 
              size={18} 
              color={getTrafficImpactColor(trafficImpact.level)} 
            />
            <Text style={styles.trafficTitle}>Traffic Impact</Text>
            <View style={[styles.trafficBadge, { backgroundColor: getTrafficImpactColor(trafficImpact.level) + '20' }]}>
              <Text style={[styles.trafficBadgeText, { color: getTrafficImpactColor(trafficImpact.level) }]}>
                {getTrafficImpactText(trafficImpact.level)}
              </Text>
            </View>
          </View>
          
          {trafficImpact.reasons.length > 0 && (
            <View style={styles.trafficReasons}>
              {trafficImpact.reasons.slice(0, 2).map((reason, index) => (
                <View key={index} style={styles.reasonItem}>
                  <Ionicons name="information-circle" size={12} color={colors.textSecondary} />
                  <Text style={styles.reasonText}>{reason}</Text>
                </View>
              ))}
            </View>
          )}

          {current.recommendations.length > 0 && (
            <View style={styles.recommendations}>
              <Text style={styles.recommendationsTitle}>Recommendations:</Text>
              <Text style={styles.recommendationsText}>
                {current.recommendations[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Hourly Forecast Preview */}
        {forecast?.hourly && forecast.hourly.length > 0 && (
          <View style={styles.forecastPreview}>
            <Text style={styles.forecastTitle}>Next 4 hours</Text>
            <View style={styles.hourlyForecast}>
              {forecast.hourly.slice(0, 4).map((hour, index) => (
                <View key={index} style={styles.hourlyItem}>
                  <Text style={styles.hourlyTime}>
                    {hour.time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                  </Text>
                  <Text style={styles.hourlyIcon}>
                    {weatherService.getWeatherIcon(hour.icon)}
                  </Text>
                  <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
                  {hour.rainChance > 30 && (
                    <Text style={styles.rainChance}>{Math.round(hour.rainChance)}%</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  containerCompact: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    borderRadius: 16,
    padding: 20,
  },
  compactGradient: {
    borderRadius: 12,
    padding: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  refreshButton: {
    padding: 4,
  },
  mainWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 48,
    marginRight: 12,
  },
  temperatureContainer: {
    flexDirection: 'column',
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  feelsLike: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  weatherRight: {
    alignItems: 'flex-end',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  details: {
    alignItems: 'flex-end',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  trafficImpact: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    marginBottom: 16,
  },
  trafficHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trafficTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 6,
    flex: 1,
  },
  trafficBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trafficBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  trafficReasons: {
    marginBottom: 8,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reasonText: {
    marginLeft: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  recommendations: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  recommendationsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  recommendationsText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  forecastPreview: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  forecastTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  hourlyForecast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hourlyItem: {
    alignItems: 'center',
    flex: 1,
  },
  hourlyTime: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  hourlyIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  hourlyTemp: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  rainChance: {
    fontSize: 8,
    color: colors.info,
    marginTop: 2,
  },
  // Compact styles
  compactContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactWeather: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  compactTemp: {
    flexDirection: 'column',
  },
  compactTempText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  compactDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  compactTraffic: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactTrafficText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default WeatherWidget; 