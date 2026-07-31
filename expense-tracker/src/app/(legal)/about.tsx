import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const FEATURES = [
  {
    icon: "wallet-outline" as const,
    title: "Expense & Income Tracking",
    description: "Record every transaction with categories, payment methods, and dates.",
    color: "#22C55E",
  },
  {
    icon: "stats-chart-outline" as const,
    title: "Detailed Analytics",
    description: "Visualize your spending with monthly charts, category breakdowns, and trends.",
    color: "#3B82F6",
  },
  {
    icon: "pie-chart-outline" as const,
    title: "Category Breakdowns",
    description: "Understand where your money goes with colorful pie and bar charts.",
    color: "#A855F7",
  },
  {
    icon: "shield-checkmark-outline" as const,
    title: "Secure & Private",
    description: "Your financial data stays encrypted and is never shared with third parties.",
    color: "#14B8A6",
  },
];

const AboutScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-black" >
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-zinc-800">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="w-10 h-10 items-center justify-center rounded-full bg-zinc-900"
        >
          <Ionicons name="chevron-back" size={22} color="#A1A1AA" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-white text-center mr-10">
          About
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* App Icon / Brand */}
        <View className="items-center px-6 pt-10 pb-6">
          <LinearGradient
            colors={["#1A1A1A", "#0D0D0D"]}
            className="w-24 h-24 rounded-3xl border border-green-500/20 items-center justify-center mb-5"
          >
            <Ionicons name="wallet-outline" size={48} color="#22C55E" />
          </LinearGradient>
          <Text className="text-2xl font-bold text-white">Expense Tracker</Text>
          <Text className="mt-1 text-sm text-zinc-500">Version 1.0.0</Text>
          <Text className="mt-4 text-center text-sm leading-6 text-zinc-400 max-w-xs">
            A simple, beautiful, and secure way to manage your personal
            finances — track expenses, monitor income, and understand your
            spending habits at a glance.
          </Text>
        </View>

        {/* Key Features */}
        <View className="px-5 mb-6">
          <Text className="mb-3 ml-1 text-xs font-semibold tracking-wider uppercase text-zinc-500">
            Key Features
          </Text>
          <View className="gap-3">
            {FEATURES.map((feature, idx) => (
              <View
                key={idx}
                className="flex-row items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
              >
                <View
                  className="items-center justify-center rounded-xl w-11 h-11"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Ionicons name={feature.icon} size={22} color={feature.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-white">
                    {feature.title}
                  </Text>
                  <Text className="mt-0.5 text-xs leading-5 text-zinc-500">
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* App Details */}
        <View className="px-5 mb-6">
          <Text className="mb-3 ml-1 text-xs font-semibold tracking-wider uppercase text-zinc-500">
            App Details
          </Text>
          <View className="overflow-hidden border bg-zinc-900 rounded-xl border-zinc-800">
            {[
              { label: "Version", value: "1.0.0" },
              { label: "Platform", value: "iOS & Android" },
              { label: "Developer", value: "Expense Tracker Team" },
              { label: "Currency", value: "INR (₹)" },
            ].map((row, idx) => (
              <View
                key={row.label}
                className={`flex-row items-center justify-between px-4 py-3.5 ${
                  idx < 3 ? "border-b border-zinc-800" : ""
                }`}
              >
                <Text className="text-sm text-zinc-400">{row.label}</Text>
                <Text className="text-sm font-medium text-white">{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tech Stack */}
        <View className="px-5 mb-6">
          <Text className="mb-3 ml-1 text-xs font-semibold tracking-wider uppercase text-zinc-500">
            Built With
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {["React Native", "Expo", "TypeScript", "Node.js", "PostgreSQL", "NativeWind"].map((tech) => (
              <View
                key={tech}
                className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2"
              >
                <Text className="text-xs text-zinc-400">{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer note */}
        <View className="px-5 pb-4">
          <Text className="text-center text-xs text-zinc-700">
            Made with love for smart money management.
          </Text>
          <Text className="text-center text-xs text-zinc-700 mt-1">
            © 2026 Expense Tracker. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;
