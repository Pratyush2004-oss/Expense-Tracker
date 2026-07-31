import React from "react";
import { Stack } from "expo-router";

const LegalLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "black" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="terms" options={{ title: "Terms & Conditions" }} />
      <Stack.Screen name="privacy" options={{ title: "Privacy Policy" }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen name="help" options={{ title: "Help Center" }} />
    </Stack>
  );
};

export default LegalLayout;
