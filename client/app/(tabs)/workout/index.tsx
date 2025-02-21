import { View, Button } from "react-native";
import { router } from 'expo-router';
import { GetLoggedInUser, SignOut } from '@/lib/auth/index';

const WorkoutScreen = () =>  {

  const handleLogout = async () => {
      try {
        await SignOut();
        router.push('/auth/sign_in');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

  return (
    <View>
      <Button 
              title="Log Out" 
              onPress={handleLogout} 
            />
    </View>
  );
}

export default WorkoutScreen;