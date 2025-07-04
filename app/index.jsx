import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router';

const index = () => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Link href="/Profile">Go to Profile</Link>
    </View>
  )
}

export default index

