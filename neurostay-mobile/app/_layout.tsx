import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="results" />
        <Stack.Screen name="map" />
        <Stack.Screen name="compare" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="profile" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
