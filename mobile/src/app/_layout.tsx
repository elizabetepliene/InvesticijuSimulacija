import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="instrument/[symbol]" />
      <Stack.Screen name="trade/[symbol]" />
      <Stack.Screen name="trade/review" />
      <Stack.Screen name="trade/success" />
      <Stack.Screen name="trade/sell" />
      <Stack.Screen name="history" />
    </Stack>
  );
}