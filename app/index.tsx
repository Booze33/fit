import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  Image, 
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import './global.css';

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex items-center justify-center w-[100vw] h-[100vh] bg-red-200">
      <Text className='font-bold text-2xl'>My Nutrition Tracker</Text>
    </SafeAreaView>
  )
}

export default HomeScreen;