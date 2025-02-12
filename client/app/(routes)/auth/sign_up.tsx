'use client';

import { View } from 'react-native';
import { Input, Icon, Button } from '@rneui/themed';
import { useState } from 'react';
import { SignUp } from '@/lib/auth/index';
import { Alert } from 'react-native';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (!email || !name || !password) {
        throw new Error('Please fill in all fields to sign up');
      }
      
      const result = await SignUp(name, email, password);
      
      Alert.alert('Success', 'Your account has been created successfully');
      
      setName('');
      setEmail('');
      setPassword('');
      
    } catch (err) {
      console.error('Error: failed to sign up', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = () => {
    console.log('hot water');
  }

  return (
    <View>
      <Input
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        leftIcon={<Icon name="person" type="material" size={24} />}
      />
      
      <Input
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Icon name="email" type="material" size={24} />}
      />
      
      <Input
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        leftIcon={<Icon name="lock" type="material" size={24} />}
      />
      
      <Button
        title="Sign Up"
        onPress={handleSubmit}
        loading={loading}
      />
    </View>
  );
};

export default SignUpScreen;