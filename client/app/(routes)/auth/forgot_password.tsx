'use client';

import { View, TextInput, Button, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { ForgotPassword, GetLoggedInUser } from '@/lib/auth/index';
import { Alert } from 'react-native';
import { router } from 'expo-router';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await GetLoggedInUser();
        if (user) {
          router.replace('/');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please fill in all fields to sign up');
      return;
    }

    try {
      setLoading(true);
      
      const result = await ForgotPassword(email);
      console.log(email)
      console.log(result)

      if (result) {
        router.push('/');
        Alert.alert('Success', 'Email sent');
      }

      setEmail('');

    } catch (err) {
      console.error('Error: failed to send email', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

  return (
    <View>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Button
        title="Enter"
        onPress={handleSubmit}
        disabled={loading}
      />

      {loading && <ActivityIndicator size="small" />}
    </View>
  );
};

export default ForgotPasswordScreen;