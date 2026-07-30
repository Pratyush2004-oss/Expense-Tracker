import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const ALL_CATEGORIES = [
  "Food", "Transport", "Entertainment", "Health", "Education", 
  "Salary", "Refund", "Freelance", "Family", "Business", "Other",
] as const;

const INCOME_CATEGORIES = ["Salary", "Refund", "Freelance", "Family", "Business", "Other"] as const;
const EXPENSE_CATEGORIES = ["Food", "Transport", "Entertainment", "Health", "Education", "Family", "Other"] as const;

const PAYMENT_METHODS = [
  "Cash", "Debit Card", "Credit Card", "Net Banking", "UPI", "Other",
] as const;

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

export interface FilterState {
  searchText: string;
  typeFilter: "All" | "Income" | "Expense";
  categoryFilter: string | null;
  paymentFilter: string | null;
}

interface TransactionFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({
  filters,
  onChange,
  resultCount,
}) => {
  const getVisibleCategories = (typeFilter: FilterState["typeFilter"]) =>
    typeFilter === "Income"
      ? INCOME_CATEGORIES
      : typeFilter === "Expense"
      ? EXPENSE_CATEGORIES
      : ALL_CATEGORIES;

  const visibleCategories = getVisibleCategories(filters.typeFilter);

  const update = (partial: Partial<FilterState>) => {
    const next = { ...filters, ...partial };
    // If category filter is no longer in the new visible set, clear it
    const newVisible = getVisibleCategories(next.typeFilter);
    if (
      next.categoryFilter &&
      !(newVisible as readonly string[]).includes(next.categoryFilter)
    ) {
      next.categoryFilter = null;
    }
    onChange(next);
  };

  const clearAll = () => {
    onChange({
      searchText: "",
      typeFilter: "All",
      categoryFilter: null,
      paymentFilter: null,
    });
  };

  const hasActiveFilters =
    filters.searchText ||
    filters.typeFilter !== "All" ||
    filters.categoryFilter ||
    filters.paymentFilter;

  return (
    <View className="px-5 pb-2">
      {/* Search Bar */}
      <View className="flex-row items-center px-4 mb-3 border bg-zinc-800/80 border-zinc-700/50 rounded-xl h-11">
        <Ionicons name="search-outline" size={16} color="#71717A" />
        <TextInput
          className="flex-1 ml-2.5 text-sm text-white"
          placeholder="Search transactions..."
          placeholderTextColor="#52525B"
          value={filters.searchText}
          onChangeText={(t) => update({ searchText: t })}
        />
        {filters.searchText ? (
          <TouchableOpacity onPress={() => update({ searchText: "" })}>
            <Ionicons name="close-circle" size={16} color="#52525B" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Type Toggle */}
      <View className="flex-row p-1 mb-3 border bg-zinc-800/80 rounded-xl border-zinc-700/50">
        {(["All", "Income", "Expense"] as const).map((type) => {
          const isActive = filters.typeFilter === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => update({ typeFilter: type })}
              activeOpacity={0.7}
              className={`flex-1 py-2 rounded-lg items-center ${
                isActive
                  ? type === "All"
                    ? "bg-zinc-700"
                    : type === "Income"
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                  : ""
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isActive
                    ? type === "All"
                      ? "text-white"
                      : type === "Income"
                      ? "text-green-400"
                      : "text-red-400"
                    : "text-zinc-500"
                }`}
              >
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Category Chips */}
      <View className="mb-1">
        <Text className="text-zinc-600 text-[10px] font-medium uppercase tracking-wider mb-2 ml-1">
          {filters.typeFilter === "Income" ? "Income Categories" : filters.typeFilter === "Expense" ? "Expense Categories" : "Categories"}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {visibleCategories.map((cat) => {
            const isActive = filters.categoryFilter === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() =>
                  update({
                    categoryFilter: isActive ? null : cat,
                  })
                }
                activeOpacity={0.7}
                className={`px-3 py-1.5 rounded-full border ${
                  isActive
                    ? "bg-green-500/15 border-green-500/40"
                    : "bg-zinc-800/60 border-zinc-700/50"
                }`}
              >
                <View className="flex-row items-center gap-1.5">
                  <View
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: CATEGORY_COLORS[cat] || "#78716C",
                    }}
                  />
                  <Text
                    className={`text-xs font-medium ${
                      isActive ? "text-green-400" : "text-zinc-400"
                    }`}
                  >
                    {cat}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Payment Method Chips */}
      <View className="mb-1">
        <View className="flex-row flex-wrap gap-2">
          {PAYMENT_METHODS.map((pm) => {
            const isActive = filters.paymentFilter === pm;
            return (
              <TouchableOpacity
                key={pm}
                onPress={() =>
                  update({ paymentFilter: isActive ? null : pm })
                }
                activeOpacity={0.7}
                className={`px-3 py-1.5 rounded-full border ${
                  isActive
                    ? "bg-green-500/15 border-green-500/40"
                    : "bg-zinc-800/60 border-zinc-700/50"
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    isActive ? "text-green-400" : "text-zinc-400"
                  }`}
                >
                  {pm}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <View className="flex-row items-center justify-between mt-3 mb-1">
          <Text className="text-xs text-zinc-600">
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </Text>
          <TouchableOpacity onPress={clearAll} activeOpacity={0.7}>
            <Text className="text-xs font-medium text-green-500/70">
              Clear all filters
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default TransactionFilter;
