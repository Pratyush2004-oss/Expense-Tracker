import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddTransactionModal from "./AddTransactionModal";

interface TabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  descriptors: Record<string, { options: Record<string, any> }>;
  navigation: {
    emit: (event: any) => any;
    navigate: (name: string) => void;
  };
}

type TabName = "index" | "transactions" | "analytics" | "profile";

const TAB_CONFIG: Record<
  TabName,
  {
    label: string;
    focusedIcon: keyof typeof Ionicons.glyphMap;
    unfocusedIcon: keyof typeof Ionicons.glyphMap;
  }
> = {
  index: { label: "Home", focusedIcon: "home", unfocusedIcon: "home-outline" },
  transactions: {
    label: "Transactions",
    focusedIcon: "swap-horizontal",
    unfocusedIcon: "swap-horizontal-outline",
  },
  analytics: {
    label: "Analytics",
    focusedIcon: "bar-chart",
    unfocusedIcon: "bar-chart-outline",
  },
  profile: {
    label: "Profile",
    focusedIcon: "person",
    unfocusedIcon: "person-outline",
  },
};

export default function TabBar({
  state,
  descriptors,
  navigation,
}: TabBarProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const insets = useSafeAreaInsets();

  // Animation for the add button
  const addBtnScale = useRef(new Animated.Value(1)).current;

  const handleAddPressIn = () => {
    Animated.spring(addBtnScale, {
      toValue: 0.9,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleAddPressOut = () => {
    Animated.spring(addBtnScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const openModal = () => setShowAddModal(true);
  const closeModal = () => setShowAddModal(false);

  // Split tabs into left (2) and right (2) to leave center space for the button
  const tabs = state.routes.filter(
    (route) => route.name in TAB_CONFIG
  ) as { key: string; name: TabName }[];

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2, 4);

  const renderTab = (route: { key: string; name: TabName }) => {
    const isFocused = state.index === state.routes.indexOf(route);

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const config = TAB_CONFIG[route.name];
    const iconName = isFocused ? config.focusedIcon : config.unfocusedIcon;

    return (
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        activeOpacity={0.7}
        className="items-center justify-center flex-1 py-1"
      >
        <Ionicons
          name={iconName}
          size={22}
          color={isFocused ? "#22C55E" : "#52525B"}
        />
        <Text
          className={`text-[10px] mt-0.5 font-medium ${isFocused ? "text-green-500" : "text-zinc-600"
            }`}
        >
          {config.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* Custom Tab Bar */}
      <View className="relative">
        {/* Floating Add Button */}
        <Animated.View
          className="absolute z-50 self-center -top-8"
          style={{
            transform: [{ scale: addBtnScale }],
            // Cross-platform shadow
            elevation: 12,
            shadowColor: "#22C55E",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.6,
            shadowRadius: 12,
          }}
        >
          {/* Outer glow ring */}
          <View className="absolute inset-[-6] rounded-full border-2 border-green-500/20" />

          <TouchableOpacity
            onPress={openModal}
            onPressIn={handleAddPressIn}
            onPressOut={handleAddPressOut}
            activeOpacity={0.9}
            className="items-center justify-center w-12 h-12 bg-green-500 rounded-full"
          >
            <LinearGradient
              colors={["#22C55E", "#16A34A"]}
              style={{
                position: "absolute",
                top: 5,
                inset: 0,
                borderRadius: 100
              }}
            />
            <Ionicons name="add" size={30} color="black" />
          </TouchableOpacity>
        </Animated.View>

        {/* Tab Bar Background */}
        <View
          className="px-2 pt-2 bg-black border-t border-zinc-900"
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
          <View className="flex-row items-center">
            {/* Left tabs */}
            {leftTabs.map(renderTab)}

            {/* Spacer for center button */}
            <View className="flex-1" />

            {/* Right tabs */}
            {rightTabs.map(renderTab)}
          </View>
        </View>
      </View>

      {/* Add Transaction Modal — extracted into its own component */}
      <AddTransactionModal visible={showAddModal} onClose={closeModal} />
    </>
  );
}
