import { Stack } from "expo-router";
import { CartProvider } from "@/app/CartContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import "@/app/firebaseConfig";

export default function RootLayout() {
  return (
    <CartProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="salon/[id]" />
          <Stack.Screen name="booking" />
          <Stack.Screen name="services" />
          <Stack.Screen name="Checkout" />
        </Stack>
      </SafeAreaProvider>
    </CartProvider>
  );
}
