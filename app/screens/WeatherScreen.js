import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import weatherService from '../../services/WeatherService';

const WeatherScreen = () => {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const data = await weatherService.getCurrentLocationWeather();
      setWeatherData(data);
    } catch (error) {
      console.error('Error loading weather data:', error);
      setError('Unable to load weather data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadWeatherData(true);
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="partly-sunny" size={64} color={colors.primary} />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !weatherData?.current) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline" size={64} color={colors.textSecondary} />
          <Text style={styles.errorTitle}>Weather Unavailable</Text>
          <Text style={styles.errorText}>{error || 'Unable to load weather data'}</Text>
          <TouchableOpacity onPress={() => loadWeatherData()} style={styles.retryButton}>
            <Ionicons name="refresh" size={20} color={colors.white} />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { current, forecast } = weatherData;
  const weatherIcon = weatherService.getWeatherIcon(current.icon);
  const weatherColor = weatherService.getWeatherColor(current.icon);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weather & Traffic</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Current Weather Card */}
        <View style={styles.currentWeatherCard}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text style={styles.locationText}>Yaoundé, Cameroon</Text>
          </View>

          <View style={styles.weatherMain}>
            <View style={styles.weatherLeft}>
              <Text style={styles.weatherIcon}>{weatherIcon}</Text>
              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>{current.temperature}°</Text>
                <Text style={styles.feelsLike}>Feels like {current.feelsLike}°</Text>
              </View>
            </View>
            
            <View style={styles.weatherRight}>
              <Text style={styles.description}>{current.description}</Text>
              <Text style={styles.humidity}>Humidity: {current.humidity}%</Text>
              <Text style={styles.wind}>Wind: {current.windSpeed} km/h</Text>
              <Text style={styles.visibility}>Visibility: {current.visibility} km</Text>
            </View>
          </View>
        </View>

        {/* Traffic Impact Card */}
        <View style={styles.trafficImpactCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="car" size={20} color={colors.textPrimary} />
            <Text style={styles.cardTitle}>Traffic Impact</Text>
          </View>

          <View style={styles.trafficImpactMain}>
            <View style={styles.impactLevel}>
              <Ionicons 
                name={getTrafficImpactIcon(current.trafficImpact.level)} 
                size={32} 
                color={getTrafficImpactColor(current.trafficImpact.level)} 
              />
              <Text style={[styles.impactText, { color: getTrafficImpactColor(current.trafficImpact.level) }]}>
                {getTrafficImpactText(current.trafficImpact.level)}
              </Text>
              <Text style={styles.delayText}>
                Expected delay: {current.trafficImpact.delayMinutes} minutes
              </Text>
            </View>

            {current.trafficImpact.reasons.length > 0 && (
              <View style={styles.reasonsContainer}>
                <Text style={styles.reasonsTitle}>Why traffic is affected:</Text>
                {current.trafficImpact.reasons.map((reason, index) => (
                  <View key={index} style={styles.reasonItem}>
                    <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Recommendations Card */}
        {current.recommendations.length > 0 && (
          <View style={styles.recommendationsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="bulb" size={20} color={colors.warning} />
              <Text style={styles.cardTitle}>Recommendations</Text>
            </View>

            <View style={styles.recommendationsList}>
              {current.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Hourly Forecast */}
        {forecast?.hourly && forecast.hourly.length > 0 && (
          <View style={styles.forecastCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="time" size={20} color={colors.textPrimary} />
              <Text style={styles.cardTitle}>Hourly Forecast</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
              {forecast.hourly.map((hour, index) => (
                <View key={index} style={styles.hourlyItem}>
                  <Text style={styles.hourlyTime}>
                    {hour.time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                  </Text>
                  <Text style={styles.hourlyIcon}>
                    {weatherService.getWeatherIcon(hour.icon)}
                  </Text>
                  <Text style={styles.hourlyTemp}>{hour.temperature}°</Text>
                  <Text style={styles.hourlyDescription}>{hour.description}</Text>
                  {hour.rainChance > 30 && (
                    <View style={styles.rainChanceContainer}>
                      <Ionicons name="water" size={12} color={colors.info} />
                      <Text style={styles.rainChance}>{Math.round(hour.rainChance)}%</Text>
                    </View>
                  )}
                  <View style={[styles.trafficIndicator, { backgroundColor: getTrafficImpactColor(hour.trafficImpact.level) + '20' }]}>
                    <Ionicons 
                      name={getTrafficImpactIcon(hour.trafficImpact.level)} 
                      size={12} 
                      color={getTrafficImpactColor(hour.trafficImpact.level)} 
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Daily Forecast */}
        {forecast?.daily && forecast.daily.length > 0 && (
          <View style={styles.forecastCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar" size={20} color={colors.textPrimary} />
              <Text style={styles.cardTitle}>5-Day Forecast</Text>
            </View>

            <View style={styles.dailyForecast}>
              {forecast.daily.map((day, index) => (
                <View key={index} style={styles.dailyItem}>
                  <Text style={styles.dailyDay}>
                    {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  <Text style={styles.dailyIcon}>
                    {weatherService.getWeatherIcon(day.icon)}
                  </Text>
                  <View style={styles.dailyTemp}>
                    <Text style={styles.dailyMax}>{day.maxTemperature}°</Text>
                    <Text style={styles.dailyMin}>{day.minTemperature}°</Text>
                  </View>
                  <Text style={styles.dailyDescription}>{day.description}</Text>
                  {day.rainChance > 30 && (
                    <Text style={styles.dailyRainChance}>{Math.round(day.rainChance)}%</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Weather Summary */}
        {forecast?.summary && (
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text" size={20} color={colors.textPrimary} />
              <Text style={styles.cardTitle}>Weather Summary</Text>
            </View>
            <Text style={styles.summaryText}>{forecast.summary}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  currentWeatherCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 64,
    marginRight: 16,
  },
  temperatureContainer: {
    flexDirection: 'column',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  feelsLike: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  weatherRight: {
    alignItems: 'flex-end',
  },
  description: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  humidity: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  wind: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  visibility: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  trafficImpactCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  trafficImpactMain: {
    alignItems: 'center',
  },
  impactLevel: {
    alignItems: 'center',
    marginBottom: 16,
  },
  impactText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  delayText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  reasonsContainer: {
    width: '100%',
  },
  reasonsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  recommendationsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recommendationsList: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  forecastCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  hourlyScroll: {
    marginTop: 12,
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 60,
  },
  hourlyTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  hourlyIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  hourlyDescription: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  rainChanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rainChance: {
    fontSize: 10,
    color: colors.info,
    marginLeft: 2,
  },
  trafficIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyForecast: {
    marginTop: 12,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dailyDay: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    width: 60,
  },
  dailyIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  dailyTemp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  dailyMax: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
  },
  dailyMin: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  dailyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    textTransform: 'capitalize',
  },
  dailyRainChance: {
    fontSize: 12,
    color: colors.info,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default WeatherScreen; 