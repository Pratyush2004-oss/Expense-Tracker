import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TRANSACTIONTYPE } from "@/types";
import { useTransactionStore } from "@/store/transaction.store";
import { useSummaryStore } from "@/store/summary.store";
import TransactionFilter, { FilterState } from "@/components/TransactionFilter";
import AddTransactionModal from "@/components/AddTransactionModal";
import Month_YearPicker from "@/components/Month_YearPicker";
import { TransactionsScreenSkeleton } from "@/components/Skeleton";

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Food: "fast-food-outline",
  Transport: "car-outline",
  Entertainment: "film-outline",
  Health: "fitness-outline",
  Education: "school-outline",
  Salary: "cash-outline",
  Refund: "return-down-back-outline",
  Freelance: "laptop-outline",
  Family: "people-outline",
  Other: "ellipsis-horizontal-outline",
};

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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDayTotal = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  const abs = Math.abs(amount);
  return `₹${abs.toFixed(2)}`;
};

const filterTransactions = (
  data: TRANSACTIONTYPE[],
  filters: FilterState
): TRANSACTIONTYPE[] => {
  return data
    .map((day) => {
      let items = day.transactions;

      // Search text
      if (filters.searchText) {
        const q = filters.searchText.toLowerCase();
        items = items.filter((tx) => tx.title.toLowerCase().includes(q));
      }

      // Type filter
      if (filters.typeFilter !== "All") {
        items = items.filter((tx) => tx.transaction_type === filters.typeFilter);
      }

      // Category filter
      if (filters.categoryFilter) {
        items = items.filter((tx) => tx.category === filters.categoryFilter);
      }

      // Payment method filter
      if (filters.paymentFilter) {
        items = items.filter((tx) => tx.payment_method === filters.paymentFilter);
      }

      return { date: day.date, transactions: items };
    })
    .filter((day) => day.transactions.length > 0);
};

const TransactionsScreen = () => {
  const insets = useSafeAreaInsets();
  const transactions = useTransactionStore((s) => s.transactions);
  const isFetching = useTransactionStore((s) => s.isFetching);
  const fetchTransaction = useTransactionStore((s) => s.fetchTransaction);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);
  const summary = useSummaryStore((s) => s.summary);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchText: "",
    typeFilter: "All",
    categoryFilter: null,
    paymentFilter: null,
  });
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTx, setEditingTx] = useState<TRANSACTIONTYPE['transactions'][number] | undefined>(undefined);

  const filteredData = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters]
  );

  const isExpanded = (date: string, count: number) =>
    expandedDays[date] ?? count <= 3;

  const toggleDay = (date: string) => {
    setExpandedDays((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const getDayTotal = (items: TRANSACTIONTYPE['transactions']) => {
    let income = 0;
    let expense = 0;
    for (const tx of items) {
      if (tx.transaction_type === "Income") income += Number(tx.amount);
      else expense += Number(tx.amount);
    }
    return { income, expense };
  };

  const handleDelete = (txId: string, title: string) => {
    Alert.alert(
      "Delete Transaction",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(txId),
        },
      ]
    );
  };

  const handleEdit = (tx: TRANSACTIONTYPE['transactions'][number]) => {
    setEditingTx(tx);
    setEditModalVisible(true);
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchTransaction();
    setRefreshing(false);
  }, [fetchTransaction]);

  const hasActiveFilters =
    filters.searchText ||
    filters.typeFilter !== "All" ||
    filters.categoryFilter ||
    filters.paymentFilter;

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <AddTransactionModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingTx(undefined);
        }}
        editTransaction={editingTx}
      />
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-2">
        <Text className="text-white text-2xl font-bold">Transactions</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setShowMonthPicker(!showMonthPicker)}
            activeOpacity={0.7}
            className={`w-9 h-9 rounded-full items-center justify-center border ${
              showMonthPicker
                ? "bg-green-500/15 border-green-500/40"
                : "bg-zinc-800 border-zinc-700"
            }`}
          >
            <Ionicons
              name="calendar-outline"
              size={16}
              color={showMonthPicker ? "#22C55E" : "#A1A1AA"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            activeOpacity={0.7}
            className={`w-9 h-9 rounded-full items-center justify-center border ${
              showFilters || hasActiveFilters
                ? "bg-green-500/15 border-green-500/40"
                : "bg-zinc-800 border-zinc-700"
            }`}
          >
            <Ionicons
              name="funnel-outline"
              size={16}
              color={showFilters || hasActiveFilters ? "#22C55E" : "#A1A1AA"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {showMonthPicker && <Month_YearPicker />}

      {/* Monthly Summary Header */}
      <View className="mx-5 mb-4 bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
        <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">
          Monthly Summary
        </Text>
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text className="text-zinc-600 text-[10px] font-medium uppercase tracking-wider">Income</Text>
            <Text className="text-green-400 text-lg font-bold mt-1">
              {formatCurrency(summary.totalIncome)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-zinc-600 text-[10px] font-medium uppercase tracking-wider">Expense</Text>
            <Text className="text-red-400 text-lg font-bold mt-1">
              {formatCurrency(summary.totalExpense)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-zinc-600 text-[10px] font-medium uppercase tracking-wider">Balance</Text>
            <Text
              className={`text-lg font-bold mt-1 ${
                summary.balance >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatCurrency(summary.balance)}
            </Text>
          </View>
        </View>
        {/* Mini progress bar */}
        {summary.totalIncome + summary.totalExpense > 0 && (
          <View className="h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${
                  summary.totalIncome + summary.totalExpense > 0
                    ? Math.min(
                        (summary.totalExpense / summary.totalIncome) * 100,
                        100
                      )
                    : 0
                }%`,
                backgroundColor: summary.totalExpense > summary.totalIncome ? "#EF4444" : "#22C55E",
              }}
            />
          </View>
        )}
      </View>

      {/* Filter Section */}
      {showFilters && (
        <TransactionFilter
          filters={filters}
          onChange={setFilters}
          resultCount={filteredData.reduce(
            (acc, day) => acc + day.transactions.length,
            0
          )}
        />
      )}

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
          <TransactionsScreenSkeleton />
        ) : filteredData.length === 0 ? (
          <View className="items-center justify-center py-32 px-5">
            <View className="w-16 h-16 rounded-full bg-zinc-800 items-center justify-center mb-4">
              <Ionicons name="receipt-outline" size={28} color="#52525B" />
            </View>
            <Text className="text-zinc-500 text-base font-medium">
              {hasActiveFilters ? "No matching transactions" : "No transactions"}
            </Text>
            <Text className="text-zinc-700 text-sm mt-1 text-center">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Fetch transactions from the Home screen to see them here"}
            </Text>
          </View>
        ) : (
          filteredData.map((day) => {
            const { income, expense } = getDayTotal(day.transactions);
            const isExpandedState = isExpanded(day.date, day.transactions.length);
            const displayItems = isExpandedState
              ? day.transactions
              : day.transactions.slice(0, 3);
            const hasMore = day.transactions.length > 3;

            return (
              <View key={day.date} className="mb-4 px-5">
                {/* Date Header */}
                <TouchableOpacity
                  onPress={() => toggleDay(day.date)}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between py-2 mb-2"
                >
                  <View className="flex-row items-center gap-2">
                    <Text className="text-zinc-400 text-sm font-semibold">
                      {formatDate(day.date)}
                    </Text>
                    <Text className="text-zinc-700 text-xs">
                      {formatDayTotal(day.date)}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-3">
                    {income > 0 && (
                      <Text className="text-green-500 text-xs font-semibold">
                        +{formatCurrency(income)}
                      </Text>
                    )}
                    {expense > 0 && (
                      <Text className="text-red-400 text-xs font-semibold">
                        -{formatCurrency(expense)}
                      </Text>
                    )}
                    {hasMore && (
                      <Ionicons
                        name={isExpandedState ? "chevron-up" : "chevron-down"}
                        size={14}
                        color="#52525B"
                      />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Transaction Items */}
                {displayItems.map((tx) => {
                  const isIncome = tx.transaction_type === "Income";
                  const catColor = CATEGORY_COLORS[tx.category] || "#78716C";
                  return (
                    <View
                      key={tx.id}
                      className="flex-row items-center bg-zinc-900/80 rounded-xl border border-zinc-800/60 px-5 py-4 mb-2.5"
                    >
                      {/* Category Icon */}
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${catColor}18` }}
                      >
                        <Ionicons
                          name={CATEGORY_ICONS[tx.category] || "ellipsis-horizontal"}
                          size={20}
                          color={catColor}
                        />
                      </View>

                      {/* Title & Meta */}
                      <View className="flex-1 ml-3.5">
                        <Text className="text-white text-base font-medium" numberOfLines={1}>
                          {tx.title}
                        </Text>
                        <View className="flex-row items-center gap-2 mt-1.5">
                          <Text className="text-zinc-600 text-xs">{tx.category}</Text>
                          <View className="w-1 h-1 rounded-full bg-zinc-700" />
                          <Text className="text-zinc-600 text-xs">{tx.payment_method}</Text>
                        </View>
                      </View>

                      {/* Amount & Actions */}
                      <View className="items-end gap-2">
                        <Text
                          className={`text-base font-bold ${
                            isIncome ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
                        </Text>
                        <View className="flex-row gap-1.5">
                          <TouchableOpacity
                            onPress={() => handleEdit(tx)}
                            activeOpacity={0.6}
                            className="w-7 h-7 rounded-full bg-green-500/10 items-center justify-center"
                          >
                            <Ionicons name="pencil-outline" size={13} color="#22C55E" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDelete(tx.id, tx.title)}
                            activeOpacity={0.6}
                            className="w-7 h-7 rounded-full bg-red-500/10 items-center justify-center"
                          >
                            <Ionicons name="trash-outline" size={13} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}

                {/* Show More / Less */}
                {hasMore && (
                  <TouchableOpacity
                    onPress={() => toggleDay(day.date)}
                    activeOpacity={0.7}
                    className="items-center py-2"
                  >
                    <Text className="text-zinc-600 text-xs font-medium">
                      {isExpandedState
                        ? "Show less"
                        : `Show ${day.transactions.length - 3} more`}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default TransactionsScreen;
