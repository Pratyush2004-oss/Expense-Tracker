import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/user.store";
import "../../global.css";

export default function RootLayout() {
  const loadStoredUser = useUserStore((s) => s.loadStoredUser);

  useEffect(() => {
    loadStoredUser();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  );
}
