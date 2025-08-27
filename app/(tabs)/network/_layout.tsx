import { Stack } from 'expo-router';

export default function NetworkStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-node" />
      <Stack.Screen name="node-details" />
    </Stack>
  );
}
