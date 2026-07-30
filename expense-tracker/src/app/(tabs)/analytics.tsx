import { View, Text, ScrollView, RefreshControl } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTransactionStore } from "@/store/transaction.store";
import { useSummaryStore } from "@/store/summary.store";
import PieChart from "@/components/PieChart";
import BarChart from "@/components/BarChart";
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

const AnalyticsScreen = () => {
  const insets = useSafeAreaInsets();
  const isFetching = useTransactionStore((s) => s.isFetching);
  const fetchTransaction = useTransactionStore((s) => s.fetchTransaction);
  const transactions = useTransactionStore((s) => s.transactions);
  const summary = useSummaryStore((s) => s.summary);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchTransaction();
    setRefreshing(false);
  }, [fetchTransaction]);

  const pieData = summary.expenseCategories.map((cat) => ({
    value: cat.amount,
    color: CATEGORY_COLORS[cat.category] || "#78716C",
    label: cat.category,
  }));

  const barData = transactions
    .map((day) => {
      const totalExpense = day.transactions
        .filter((tx) => tx.transaction_type === "Expense")
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
      const date = new Date(day.date);
      return {
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        value: totalExpense,
        color: "#EF4444",
      };
    })
    .filter((d) => d.value > 0);

  const isPositive = summary.balance >= 0;

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <View className="px-5 py-2">
        <Text className="text-white text-2xl font-bold">Analytics</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#22C55E"
            colors={["#22C55E"]}
            progressBackgroundColor="#18181B"
          />
        }
      >
        {isFetching ? (
          <HomeScreenSkeleton />
        ) : (
          <>
            <View className="flex-row px-5 gap-3 mb-6">
              <View className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                <View className="w-9 h-9 rounded-full bg-green-500/15 items-center justify-center mb-3">
                  <Ionicons name="trending-down-outline" size={16} color="#22C55E" />
                </View>
                <Text className="text-zinc-500 text-xs font-medium mb-1">Income</Text>
                <Text className="text-green-400 text-lg font-bold">{formatCurrency(summary.totalIncome)}</Text>
              </View>
              <View className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                <View className="w-9 h-9 rounded-full bg-red-500/15 items-center justify-center mb-3">
                  <Ionicons name="trending-up-outline" size={16} color="#EF4444" />
                </View>
                <Text className="text-zinc-500 text-xs font-medium mb-1">Expense</Text>
                <Text className="text-red-400 text-lg font-bold">{formatCurrency(summary.totalExpense)}</Text>
              </View>
              <View className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                <View className={`w-9 h-9 rounded-full items-center justify-center mb-3 ${isPositive ? "bg-green-500/15" : "bg-red-500/15"}`}>
                  <Ionicons name={isPositive ? "wallet-outline" : "alert-circle-outline"} size={16} color={isPositive ? "#22C55E" : "#EF4444"} />
                </View>
                <Text className="text-zinc-500 text-xs font-medium mb-1">Balance</Text>
                <Text className={`text-lg font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>{formatCurrency(summary.balance)}</Text>
              </View>
            </View>

            <View className="mx-5 mb-6 bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <Text className="text-white text-base font-bold mb-4">Expense Breakdown</Text>
              {pieData.length > 0 ? <PieChart data={pieData} size={200} /> : (
                <View className="items-center justify-center py-10">
                  <Text className="text-zinc-600 text-sm">No expense data available</Text>
                </View>
              )}
            </View>

            <View className="mx-5 mb-6 bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <Text className="text-white text-base font-bold mb-4">Daily Expenses</Text>
              {barData.length > 0 ? <BarChart data={barData} height={200} /> : (
                <View className="items-center justify-center py-10">
                  <Text className="text-zinc-600 text-sm">No expense data available</Text>
                </View>
              )}
            </View>

            {summary.incomeCategories.length > 0 && (
              <View className="mx-5 mb-6 bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
                <Text className="text-white text-base font-bold mb-4">Income Breakdown</Text>
                <PieChart data={summary.incomeCategories.map((cat) => ({
                  value: cat.amount,
                  color: CATEGORY_COLORS[cat.category] || "#22C55E",
                  label: cat.category,
                }))} size={200} />
              </View>
            )}

            {summary.totalIncome === 0 && summary.totalExpense === 0 && (
              <View className="items-center justify-center py-16 px-5">
                <View className="w-16 h-16 rounded-full bg-zinc-800 items-center justify-center mb-4">
                  <Ionicons name="stats-chart-outline" size={28} color="#52525B" />
                </View>
                <Text className="text-zinc-500 text-base font-medium">No data yet</Text>
                <Text className="text-zinc-700 text-sm mt-1 text-center">Fetch transactions to see your analytics</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;