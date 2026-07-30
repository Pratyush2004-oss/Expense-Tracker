import React, { useEffect } from "react";
import { Tabs, Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import TabBar from "@/components/TabBar";
import { useUserStore } from "@/store/user.store";
import { useTransactionStore } from "@/store/transaction.store";

export default function TabLayout() {
  const { user, isLoading } = useUserStore();
  const { year_month, fetchTransaction } = useTransactionStore();

  // Fetch transactions when the user is authenticated
  // 👇 MUST be placed before early returns to keep hook order consistent
  useEffect(() => {
    if (user) fetchTransaction()
  }, [year_month, user]);

  // Show a brief loading indicator while auth state is being restored
  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-black">
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  // Redirect to auth if user is not logged in
  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}