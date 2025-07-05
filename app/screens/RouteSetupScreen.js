import BottomNav from '../../components/BottomNav';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


export default function MapPage() {
  const carPositions = [
    { id: 'car1', latitude: 37.78825, longitude: -122.4324 },
    { id: 'car2', latitude: 37.78925, longitude: -122.4314 },
    { id: 'car3', latitude: 37.78725, longitude: -122.4334 },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {carPositions.map(car => (
          <Marker
            key={car.id}
            coordinate={{ latitude: car.latitude, longitude: car.longitude }}
            pinColor="red" // show as red dot
          />
        ))}
      </MapView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
