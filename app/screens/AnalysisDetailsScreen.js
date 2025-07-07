import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import colors from '../../constants/colors';

export default function AnalysisDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let analysis = null;
  try {
    analysis = typeof params.analysis === 'string' ? JSON.parse(params.analysis) : params.analysis;
  } catch (e) {
    analysis = null;
  }
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);
  if (!analysis) {
    return (
      <View style={styles.centered}><Text>Invalid analysis data.</Text></View>
    );
  }
  const { location, timestamp, imageUri, analysis: a } = analysis;
  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={{top:10, left:10, right:10, bottom:10}}>
            <Ionicons name="arrow-back" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analysis Details</Text>
        </View>
        <ScrollView
          contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: 36 }]}
          showsVerticalScrollIndicator={true}
        >
          {/* Image Card */}
          {imageUri && (
            <View style={styles.imageCard}>
              <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            </View>
          )}
          {/* Location and time */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            <Text style={styles.locationText}>{location}</Text>
            <Text style={styles.timestamp}>{new Date(timestamp).toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          {/* Main metrics */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="analytics" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Key Metrics</Text>
            </View>
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { backgroundColor: '#E3F2FD' }]}> 
                <Ionicons name="car" size={22} color={colors.primary} />
                <Text style={styles.metricLabel}>Traffic</Text>
                <Text style={[styles.metricValue, { color: colors.primary }]}>{a.trafficLevel}</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: '#FFF3E0' }]}> 
                <Ionicons name="trending-up" size={22} color={colors.warning} />
                <Text style={styles.metricLabel}>Congestion</Text>
                <Text style={[styles.metricValue, { color: colors.warning }]}>{a.congestionScore}%</Text>
              </View>
            </View>
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { backgroundColor: '#E8F5E9' }]}> 
                <Ionicons name="navigate" size={20} color={colors.success} />
                <Text style={styles.metricLabel}>Road</Text>
                <Text style={[styles.metricValue, { color: colors.success }]}>{a.roadCondition}</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: '#ECEFF1' }]}> 
                <Ionicons name="cloud" size={20} color={colors.textSecondary} />
                <Text style={styles.metricLabel}>Weather</Text>
                <Text style={styles.metricValue}>{a.weatherCondition}</Text>
              </View>
            </View>
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { backgroundColor: '#F3E5F5' }]}> 
                <Ionicons name="car-sport" size={20} color={colors.primary} />
                <Text style={styles.metricLabel}>Vehicles</Text>
                <Text style={styles.metricValue}>{a.vehicleCount}</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: '#E0F2F1' }]}> 
                <Ionicons name="walk" size={20} color={colors.success} />
                <Text style={styles.metricLabel}>Pedestrians</Text>
                <Text style={styles.metricValue}>{a.pedestrianCount}</Text>
              </View>
            </View>
          </View>
          {/* Incidents */}
          {a.incidents && a.incidents.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="warning" size={20} color={colors.warning} />
                  <Text style={styles.sectionTitle}>Incidents</Text>
                </View>
                {a.incidents.map((inc, i) => (
                  <View key={i} style={styles.incidentRow}>
                    <Ionicons name="alert-circle" size={18} color={colors.warning} />
                    <Text style={styles.incidentText}>{inc}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
          {/* Recommendations */}
          {a.recommendations && a.recommendations.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="bulb" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Recommendations</Text>
                </View>
                {a.recommendations.map((rec, i) => (
                  <View key={i} style={styles.incidentRow}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                    <Text style={styles.incidentText}>{rec}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, elevation: 2 },
  backButton: { marginRight: 16, padding: 10, borderRadius: 20, backgroundColor: colors.background },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: colors.textPrimary },
  content: { padding: 22 },
  imageCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 22, backgroundColor: colors.cardBackground, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  image: { width: '100%', height: 220, borderRadius: 16, backgroundColor: '#eee' },
  section: { marginBottom: 22 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: colors.textPrimary, marginLeft: 8 },
  locationText: { fontSize: 16, color: colors.textPrimary, fontWeight: '600', marginBottom: 2 },
  timestamp: { fontSize: 13, color: colors.textSecondary, marginLeft: 2, marginBottom: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8, opacity: 0.5 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  metricCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center', marginHorizontal: 4, elevation: 1 },
  metricLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  metricValue: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary, marginTop: 2 },
  incidentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  incidentText: { fontSize: 15, color: colors.textPrimary, marginLeft: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
}); 