import { StyleSheet, Image, Platform, Text, Button, View } from 'react-native';
import { GetLoggedInUser } from '@/lib/auth/index';
import { useEffect, useState } from 'react';
import { router, Link } from 'expo-router';
import './global.css';

export default function index() {
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

  return (
    <View className="w-[100vw] h-[100vh] flex justify-center items-center bg-gray-400 flex-col">
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
    </View>
  );
}