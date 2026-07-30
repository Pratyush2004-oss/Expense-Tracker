import { useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/user.store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function SplashScreen() {
  const router = useRouter();
  const isLoading = useUserStore((s) => s.isLoading);
  const user = useUserStore((s) => s.user);

  const redirected = useRef(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  // Entrance animation
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 10,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing icon glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconPulse, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(iconPulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Auto-redirect once auth state is resolved
  useEffect(() => {
    if (!isLoading && !redirected.current) {
      redirected.current = true;
      const timer = setTimeout(() => {
        if (user) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, user]);

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={["#000000", "#050505", "#0A0A0A"]}
        className="absolute inset-0"
      />

<View className="flex-1 items-center justify-center px-6">
        <Animated.View
          className="items-center"
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          {/* Animated Icon */}
          <Animated.View
            className="w-28 h-28 rounded-3xl items-center justify-center mb-8 border border-green-500/20"
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.08)",
              transform: [{ scale: iconPulse }],
            }}
          >
            <LinearGradient
              colors={["rgba(34, 197, 94, 0.15)", "rgba(34, 197, 94, 0.05)"]}
              className="absolute inset-0 rounded-3xl"
            />
            <Ionicons name="wallet-outline" size={52} color="#22C55E" />
          </Animated.View>

          {/* App Name */}
          <Text className="text-white text-5xl font-bold tracking-tight">
            Expense
            <Text className="text-green-500"> Tracker</Text>
          </Text>

          {/* Tagline */}
          <Animated.Text
            className="text-zinc-500 text-base mt-3 tracking-wide"
            style={{ opacity: taglineOpacity }}
          >
            Track smarter, spend wiser
          </Animated.Text>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View
          className="absolute bottom-24 items-center gap-3"
          style={{ opacity: taglineOpacity }}
        >
          <View className="flex-row items-center gap-2">
            <ActivityIndicator size="small" color="#22C55E" />
            <Text className="text-zinc-600 text-sm">
              {isLoading ? "Restoring your session..." : "Getting ready..."}
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
