import { View, Text, Button } from 'react-native';
import { GetLoggedInUser, SignOut } from '@/lib/auth/index';
import { useEffect, useState } from 'react';
import { router, Link } from 'expo-router';
import './global.css';

export default function Index() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const user = await GetLoggedInUser();
        if (user) {
          router.replace('/workout');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await SignOut();
      router.push('/auth/sign_in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View className="w-full h-full flex justify-center items-center bg-gray-400 flex-col">
      <View>
        <Link
          href="/auth/sign_up"
          className="text-lg text-center"
        >
          Don't have an account?{" "}
          <Text className="text-primary-500">Sign Up</Text>
        </Link>
        <Link
          href="/auth/sign_in"
          className="text-lg text-center"
        >
          <Text className="text-primary-500">Sign In</Text>
        </Link>
      </View>

      <Button 
        title="Log Out" 
        onPress={handleLogout} 
      />
    </View>
  );
}