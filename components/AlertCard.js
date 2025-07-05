import { View, Text, StyleSheet,Image } from 'react-native';
import colors from '../constants/colors';

const AlertCard = ({ alert }) => (
  <View style={styles.card}>
    <Image source={{ uri: alert.image }} style={styles.image} />
    
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{alert.title}</Text>
        <Text style={styles.time}>{alert.time}</Text>
      </View>
      <Text style={styles.description}>{alert.description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 2,
    alignItems: 'center',
    gap: 10
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee'
  },
  content: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  time: {
    fontSize: 12,
    color: '#888'
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: '#555'
  }
});

export default AlertCard;
