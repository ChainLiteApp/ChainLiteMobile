import { Stack } from 'expo-router';

export default function MineStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
