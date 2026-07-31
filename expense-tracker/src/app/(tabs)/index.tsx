import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTransactionStore } from "@/store/transaction.store";
import { useSummaryStore } from "@/store/summary.store";
import Month_YearPicker from "@/components/Month_YearPicker";
import { HomeScreenSkeleton } from "@/components/Skeleton";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#EF4444",
  Transport: "#F59E0B",
  Entertainment: "#8B5CF6",
  Health: "#06B6D4",
  Education: "#3B82F6",
  Salary: "#22C55E",
  Refund: "#14B8A6",
  Freelance: "#A855F7",
  Family: "#EC4899",
  Other: "#78716C",
};

const formatCurrency = (amount: number) => {
  const abs = Math.abs(amount);
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `₹${(abs / 1000).toFixed(1)}K`;
  return `₹${amount.toFixed(2)}`;
};

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const isFetching = useTransactionStore((s) => s.isFetching);
  const summary = useSummaryStore((s) => s.summary);

  const isPositive = summary.balance >= 0;

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-5 py-2">
        <Text className="text-white text-2xl font-bold">Home</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {isFetching ? (
          <HomeScreenSkeleton />
        ) : (
          <>
            <Month_YearPicker />

        {/* Summary Cards */}
        <View className="flex-row px-5 gap-3 mb-6">
          {/* Income */}
          <View className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
            <View className="w-9 h-9 rounded-full bg-green-500/15 items-center justify-center mb-3">
              <Ionicons name="trending-down-outline" size={16} color="#22C55E" />
            </View>
            <Text className="text-zinc-500 text-xs font-medium mb-1">Income</Text>
            <Text className="text-green-400 text-lg font-bold">
              {formatCurrency(summary.totalIncome)}
            </Text>
          </View>

          {/* Expense */}
          <View className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
            <View className="w-9 h-9 rounded-full bg-red-500/15 items-center justify-center mb-3">
              <Ionicons name="trending-up-outline" size={16} color="#EF4444" />
            </View>
            <Text className="text-zinc-500 text-xs font-medium mb-1">Expense</Text>
            <Text className="text-red-400 text-lg font-bold">
              {formatCurrency(summary.totalExpense)}
            </Text>
          </View>

          {/* Balance */}
          <View className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
            <View className={`w-9 h-9 rounded-full items-center justify-center mb-3 ${isPositive ? "bg-green-500/15" : "bg-red-500/15"}`}>
              <Ionicons name={isPositive ? "wallet-outline" : "alert-circle-outline"} size={16} color={isPositive ? "#22C55E" : "#EF4444"} />
            </View>
            <Text className="text-zinc-500 text-xs font-medium mb-1">Balance</Text>
            <Text className={`text-lg font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
              {formatCurrency(summary.balance)}
            </Text>
          </View>
        </View>

        {/* Expense Breakdown */}
        {summary.expenseCategories.length > 0 && (
          <View className="mx-5 mb-6 bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <Text className="text-white text-base font-bold mb-4">Expense Breakdown</Text>
            {summary.expenseCategories.map((cat) => (
              <View key={cat.category} className="mb-3 last:mb-0">
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-2">
                    <View
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.category] || "#78716C" }}
                    />
                    <Text className="text-zinc-300 text-sm font-medium">{cat.category}</Text>
                  </View>
                  <Text className="text-white text-sm font-semibold">
                    {formatCurrency(cat.amount)}
                  </Text>
                </View>
                <View className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: CATEGORY_COLORS[cat.category] || "#78716C",
                    }}
                  />
                </View>
                <Text className="text-zinc-600 text-xs mt-0.5">{cat.percentage}% • {cat.count} transaction{cat.count > 1 ? "s" : ""}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Income Breakdown */}
        {summary.incomeCategories.length > 0 && (
          <View className="mx-5 mb-6 bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <Text className="text-white text-base font-bold mb-4">Income Breakdown</Text>
            {summary.incomeCategories.map((cat) => (
              <View key={cat.category} className="mb-3 last:mb-0">
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-2">
                    <View
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.category] || "#22C55E" }}
                    />
                    <Text className="text-zinc-300 text-sm font-medium">{cat.category}</Text>
                  </View>
                  <Text className="text-green-400 text-sm font-semibold">
                    {formatCurrency(cat.amount)}
                  </Text>
                </View>
                <View className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: CATEGORY_COLORS[cat.category] || "#22C55E",
                    }}
                  />
                </View>
                <Text className="text-zinc-600 text-xs mt-0.5">{cat.percentage}% • {cat.count} transaction{cat.count > 1 ? "s" : ""}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {summary.totalIncome === 0 && summary.totalExpense === 0 && (
          <View className="items-center justify-center py-16 px-5">
            <View className="w-16 h-16 rounded-full bg-zinc-800 items-center justify-center mb-4">
              <Ionicons name="receipt-outline" size={28} color="#52525B" />
            </View>
            <Text className="text-zinc-500 text-base font-medium">No transactions yet</Text>
            <Text className="text-zinc-700 text-sm mt-1 text-center">
              Press the Fetch button to load your transactions
            </Text>
          </View>
        )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;