import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "black" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Sign In" }} />
      <Stack.Screen name="signup" options={{ title: "Create Account" }} />
    </Stack>
  );
};

export default AuthLayout;