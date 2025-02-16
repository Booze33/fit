'use client';

import { View, TextInput, Button, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { SignUp, GetLoggedInUser } from '@/lib/auth/index';
import { Alert } from 'react-native';
import { router } from 'expo-router';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
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
    if (!email || !name || !password) {
      Alert.alert('Error', 'Please fill in all fields to sign up');
      return;
    }

    try {
      setLoading(true);
      
      const result = await SignUp(name, email, password);

      if (result) {
        router.push('/');
        Alert.alert('Success', 'Your account has been created successfully');
      }

      setName('');
      setEmail('');
      setPassword('');
      
    } catch (err) {
      console.error('Error: failed to sign up', err);
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
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      
      <Button
        title="Sign Up"
        onPress={handleSubmit}
        disabled={loading}
      />

      {loading && <ActivityIndicator size="small" />}
    </View>
  );
};

export default SignUpScreen;