import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Feather } from '@expo/vector-icons';

export function ThemeToggleButton() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      className={`flex-row items-center justify-center p-2 rounded-full ${
        colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
      }`}
      style={{ minWidth: 100 }}
    >
      <Feather
        name={colorScheme === 'dark' ? 'sun' : 'moon'}
        size={20}
        color={colorScheme === 'dark' ? '#fff' : '#000'}
      />
      <Text
        className={`ml-2 ${
          colorScheme === 'dark' ? 'text-white' : 'text-black'
        }`}
      >
        {colorScheme === 'dark' ? 'Light' : 'Dark'}
      </Text>
    </TouchableOpacity>
  );
}