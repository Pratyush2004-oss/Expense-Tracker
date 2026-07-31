import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/user.store";
import { useTransactionStore } from "@/store/transaction.store";
import { useSummaryStore } from "@/store/summary.store";

const SETTINGS_SECTIONS = [
  {
    title: "Preferences",
    items: [
      // {
      //   icon: "person-outline" as const,
      //   label: "Edit Profile",
      //   color: "#22C55E",
      //   badge: null as string | null,
      // },
      // {
      //   icon: "notifications-outline" as const,
      //   label: "Notifications",
      //   color: "#3B82F6",
      //   badge: null,
      // },
      {
        icon: "color-palette-outline" as const,
        label: "Theme",
        color: "#A855F7",
        badge: "Dark",
      },
      {
        icon: "language-outline" as const,
        label: "Currency",
        color: "#F59E0B",
        badge: "INR",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        icon: "help-circle-outline" as const,
        label: "Help Center",
        color: "#06B6D4",
        badge: null,
        route: "/(legal)/help" as const,
      },
      {
        icon: "document-text-outline" as const,
        label: "Terms & Conditions",
        color: "#F59E0B",
        badge: null,
        route: "/(legal)/terms" as const,
      },
      {
        icon: "shield-checkmark-outline" as const,
        label: "Privacy Policy",
        color: "#14B8A6",
        badge: null,
        route: "/(legal)/privacy" as const,
      },
      {
        icon: "information-circle-outline" as const,
        label: "About",
        color: "#8B5CF6",
        badge: "v1.0.0",
        route: "/(legal)/about" as const,
      },
    ],
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useUserStore();
  const transactions = useTransactionStore((s) => s.transactions);
  const summary = useSummaryStore((s) => s.summary);

  const totalTxCount = transactions.reduce((sum, day) => sum + day.transactions.length, 0);
  const uniqueCategories = new Set(
    transactions.flatMap((day) => day.transactions.map((tx) => tx.category))
  ).size;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-5 py-2">
        <Text className="text-2xl font-bold text-white">Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Profile Card */}
        <Animated.View
          className="mx-5 overflow-hidden rounded-2xl"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <LinearGradient
            colors={["#1A1A1A", "#0D0D0D"]}
            style={{
              padding: 24,
              borderWidth: 2,
              borderColor: "#1A1A1A",
              borderRadius: 24,
            }}
          >
            <View className="flex-row items-center gap-5">
              {/* Avatar */}
              <View className="items-center justify-center w-20 h-20 border-2 rounded-full bg-green-500/20 border-green-500/30">
                <Text className="text-2xl font-bold  text-green-400">
                  {user?.name ? getInitials(user.name) : "?"}
                </Text>
              </View>

              {/* User Info */}
              <View className="flex-1">
                <Text className="text-xl font-bold text-white">
                  {user?.name || "User"}
                </Text>
                <Text className="mt-1 text-sm text-zinc-400">
                  {user?.email || "No email"}
                </Text>
                {user?.created_at && (
                  <View className="flex-row items-center mt-2 gap-1.5">
                    <Ionicons
                      name="calendar-outline"
                      size={12}
                      color="#52525B"
                    />
                    <Text className="text-xs text-zinc-600">
                      Joined {formatDate(user.created_at)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View
          className="flex-row gap-3 mx-5 mt-5"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {([
            { label: "Transactions", value: String(totalTxCount), icon: "repeat-outline" as const, color: "#22C55E" },
            { label: "This Month", value: `₹${summary.totalExpense.toFixed(0)}`, icon: "trending-up-outline" as const, color: "#3B82F6" },
            { label: "Categories", value: String(uniqueCategories), icon: "grid-outline" as const, color: "#A855F7" },
          ] as const).map((stat) => (
            <View
              key={stat.label}
              className="items-center flex-1 p-4 border bg-zinc-900 rounded-xl border-zinc-800"
            >
              <View
                className="items-center justify-center mb-2 rounded-full w-9 h-9"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text className="text-lg font-bold text-white">{stat.value}</Text>
              <Text className="text-zinc-500 text-xs mt-0.5">{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section) => (
          <Animated.View
            key={section.title}
            className="mx-5 mt-6"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Text className="mb-3 ml-1 text-xs font-semibold tracking-wider uppercase text-zinc-500">
              {section.title}
            </Text>
            <View className="overflow-hidden border bg-zinc-900 rounded-xl border-zinc-800">
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={0.6}
                  className={`flex-row items-center px-4 py-4 ${itemIdx < section.items.length - 1
                    ? "border-b border-zinc-800"
                    : ""
                    }`}
                  onPress={() => {
                    if ("route" in item && item.route) {
                      router.push(item.route);
                    }
                  }}
                >
                  <View
                    className="items-center justify-center rounded-lg w-9 h-9"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={item.color}
                    />
                  </View>
                  <Text className="flex-1 ml-3 text-base font-medium text-white">
                    {item.label}
                  </Text>
                  {item.badge && (
                    <View className="bg-zinc-800 px-2.5 py-0.5 rounded-full mr-2">
                      <Text className="text-xs text-zinc-400">
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#52525B"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Logout Button */}
        <Animated.View
          className="mx-5 mt-8"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            className="h-14 rounded-xl bg-red-500/10 border border-red-500/20 items-center justify-center flex-row gap-2.5"
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-base font-semibold text-red-400">
              Sign Out
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Legal Footer Links */}
        <Animated.View
          className="flex-row items-center justify-center mt-8 pb-4 gap-3"
          style={{ opacity: fadeAnim }}
        >
          <TouchableOpacity
            onPress={() => router.push("/(legal)/terms")}
            activeOpacity={0.7}
          >
            <Text className="text-xs text-zinc-600 underline">
              Terms & Conditions
            </Text>
          </TouchableOpacity>
          <Text className="text-xs text-zinc-700">|</Text>
          <TouchableOpacity
            onPress={() => router.push("/(legal)/privacy")}
            activeOpacity={0.7}
          >
            <Text className="text-xs text-zinc-600 underline">
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
