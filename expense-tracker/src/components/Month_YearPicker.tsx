import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTransactionStore } from "@/store/transaction.store";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const Month_YearPicker = () => {
  const year_month = useTransactionStore((s) => s.year_month);
  const setYear_month = useTransactionStore((s) => s.setYear_month);

  // Initialize local selection state from the store
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const [, m] = year_month.split("-").map(Number);
    return m; // 1-12
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const [y] = year_month.split("-").map(Number);
    return y;
  });

  const scrollRef = useRef<ScrollView>(null);

  // Scroll to the initially selected month on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: (selectedMonth - 1) * 100, animated: false });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const goToPrevYear = () => setSelectedYear((y) => y - 1);
  const goToNextYear = () => setSelectedYear((y) => y + 1);

  const handleFetch = () => {
    setYear_month(`${selectedYear}-${selectedMonth}`);
  };

  return (
    <View className="px-5 py-2">
      {/* Year Navigation */}
      <View className="flex-row items-center justify-center gap-4 mb-3">
        <TouchableOpacity
          onPress={goToPrevYear}
          activeOpacity={0.6}
          className="items-center justify-center w-8 h-8 border rounded-full bg-zinc-800 border-zinc-700"
        >
          <Ionicons name="chevron-back" size={14} color="#A1A1AA" />
        </TouchableOpacity>

        <Text className="text-lg font-bold text-white">{selectedYear}</Text>

        <TouchableOpacity
          onPress={goToNextYear}
          activeOpacity={0.6}
          className="items-center justify-center w-8 h-8 border rounded-full bg-zinc-800 border-zinc-700"
        >
          <Ionicons name="chevron-forward" size={14} color="#A1A1AA" />
        </TouchableOpacity>
      </View>

      {/* Month Scroll */}
      <View className="mb-3">
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-1"
        >
          {MONTH_NAMES.map((name, index) => {
            const monthNum = index + 1;
            const isSelected = monthNum === selectedMonth;
            return (
              <TouchableOpacity
                key={name}
                onPress={() => {
                  setSelectedMonth(monthNum);
                  scrollRef.current?.scrollTo({ x: index * 80, animated: true });
                }}
                activeOpacity={0.7}
                className={`py-2 px-3 rounded-xl border items-center min-w-[68px] ${isSelected
                  ? "bg-green-500/15 border-green-500/40"
                  : "bg-zinc-800/60 border-zinc-700/50"
                  }`}
              >
                <Text
                  className={`text-xs font-semibold ${isSelected ? "text-green-400" : "text-zinc-400"
                    }`}
                >
                  {name.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Fetch Button */}
      <TouchableOpacity
        onPress={handleFetch}
        activeOpacity={0.8}
        className="flex-row items-center justify-center gap-2 bg-green-500/15 border border-green-500/30 px-4 py-2.5 rounded-xl"
      >
        <Ionicons name="refresh-outline" size={14} color="#22C55E" />
        <Text className="text-sm font-semibold text-green-400">
          Fetch
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Month_YearPicker;