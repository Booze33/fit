import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from "nativewind";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ThemeToggleButton } from '../components/ThemeToggleButton';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme == 'dark' ? DarkTheme : DefaultTheme;

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerRight: () => <ThemeToggleButton />,
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#fff'
          },
          headerTintColor: colorScheme == 'dark' ? '#fff' : '#000'
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(routes)/auth/sign_in" />
        <Stack.Screen name="(routes)/notification/index" />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
