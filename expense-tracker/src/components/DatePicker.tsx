import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  label?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const ITEM_HEIGHT = 44;
const SPACER_COUNT = 3;

// The scroll window — tall enough to show ~5 items plus header space
const SCROLL_PORT_HEIGHT = 256;
const SCROLL_HEADER_OFFSET = 26; // py(8) + header text + mb(28) = ~36px

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const years = Array.from({ length: 120 }, (_, i) => 2000 + i);

// Wrap items with spacer padding so scrolling past the first/last item feels smooth
const withSpacers = <T,>(items: readonly T[]): (T | null)[] => {
  const spacerArr: null[] = Array(SPACER_COUNT).fill(null);
  return [...spacerArr, ...items, ...spacerArr];
};

const MONTHS_DISPLAY = withSpacers(MONTHS);
const YEARS_DISPLAY = withSpacers(years);

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onDateChange,
  label = "DATE",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [selectedDay, setSelectedDay] = useState(date.getDate());
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());

  // Refs for scroll positions
  const monthScrollRef = useRef<ScrollView>(null);
  const dayScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Derived days for current selection
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const daysDisplay = withSpacers(days);

  // Get scroll indices derived from current state (add spacer offset)
  const monthIndex = selectedMonth + SPACER_COUNT;
  const dayIndex = selectedDay - 1 + SPACER_COUNT;
  const yearIndex = years.indexOf(selectedYear) + SPACER_COUNT;

  // Clamp day when month/year changes (e.g. Jan 31 → Feb only has 28 days)
  useEffect(() => {
    if (selectedDay > daysInMonth) {
      const clampedDay = daysInMonth;
      setSelectedDay(clampedDay);
    }
  }, [selectedDay, daysInMonth]);

  // Scroll day column when days change (e.g. Jan 31 → Feb 28)
  // Use Math.min to stay in bounds even if clamping effect hasn't re-rendered yet
  useEffect(() => {
    if (isOpen) {
      scrollToIndex(dayScrollRef, Math.min(selectedDay, daysInMonth) - 1 + SPACER_COUNT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysInMonth, isOpen]);

  const scrollToIndex = (
    ref: React.RefObject<ScrollView | null>,
    index: number
  ) => {
    ref.current?.scrollTo({
      y: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  // Scroll to initial positions when opened (only on isOpen transition)
  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();

      // Delay scrolling slightly to let the modal render
      const timer = setTimeout(() => {
        scrollToIndex(monthScrollRef, monthIndex);
        scrollToIndex(dayScrollRef, dayIndex);
        scrollToIndex(yearScrollRef, yearIndex);
      }, 100);

      return () => clearTimeout(timer);
    }
    // Only run on isOpen change — NOT on state changes to avoid
    // fighting the user's scroll gestures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const getIndexFromOffset = (y: number, items: unknown[]) => {
    const index = Math.round(y / ITEM_HEIGHT);
    return Math.max(0, Math.min(index, items.length - 1));
  };

  // Shared handler for scroll-end events (itemsWithSpacers is the display array)
  const handleScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    setter: (val: number) => void,
    displayItems: unknown[],
    realItems: unknown[],
    offset: number = 0
  ) => {
    const y = e.nativeEvent.contentOffset.y;
    const displayIndex = getIndexFromOffset(y, displayItems);
    const realIndex = displayIndex - SPACER_COUNT;
    if (realIndex >= 0 && realIndex < realItems.length) {
      setter(realIndex + offset);
    }
  };

  // Handle drag-end: skip if momentum will follow
  const handleDragEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    setter: (val: number) => void,
    displayItems: unknown[],
    realItems: unknown[],
    offset: number = 0
  ) => {
    const vel = e.nativeEvent.velocity?.y;
    if (vel !== undefined && vel !== 0 && !isNaN(vel)) return;
    const y = e.nativeEvent.contentOffset.y;
    const displayIndex = getIndexFromOffset(y, displayItems);
    const realIndex = displayIndex - SPACER_COUNT;
    if (realIndex >= 0 && realIndex < realItems.length) {
      setter(realIndex + offset);
    }
  };

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    onDateChange(newDate);
    closePicker();
  };

  const closePicker = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
    });
  };

  const handleTriggerPress = () => {
    // Sync internal state from the date prop before opening
    setSelectedMonth(date.getMonth());
    setSelectedDay(date.getDate());
    // Guard against year outside the 2000-2119 range
    const year = date.getFullYear();
    setSelectedYear(years.includes(year) ? year : Math.max(2000, Math.min(2119, year)));
    setIsOpen(true);
  };

  const formattedDate = `${
    MONTHS_SHORT[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={handleTriggerPress}
        activeOpacity={0.7}
        className="w-full"
      >
        <Text className="mb-2 ml-1 text-xs font-medium text-zinc-400">
          {label}
        </Text>
        <View className="flex-row items-center h-12 px-4 border bg-zinc-800 border-zinc-700 rounded-xl">
          <Ionicons name="calendar-outline" size={18} color="#71717A" />
          <View className="flex-1 ml-3">
            <Text className="text-base font-medium text-white">
              {formattedDate}
            </Text>
            <Text className="text-xs text-zinc-500">{dayOfWeek}</Text>
          </View>
          <Ionicons name="chevron-down" size={16} color="#52525B" />
        </View>
      </TouchableOpacity>

      {/* Picker Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={closePicker}
        statusBarTranslucent
      >
        <Animated.View
          className="justify-end flex-1 bg-black/70"
          style={{ opacity: fadeAnim }}
        >
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={closePicker}
          />

          <Animated.View
            className="overflow-hidden border-t bg-zinc-900 rounded-t-3xl border-zinc-800"
            style={{ transform: [{ translateY: slideAnim }] }}
          >
            {/* Handle */}
            <View className="self-center w-12 h-1 mt-4 mb-4 rounded-full bg-zinc-700" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pb-4 border-b border-zinc-800">
              <TouchableOpacity onPress={closePicker} activeOpacity={0.7}>
                <Text className="text-sm font-medium text-zinc-400">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-base font-bold text-white">Select Date</Text>
              <TouchableOpacity onPress={handleConfirm} activeOpacity={0.7}>
                <Text className="text-sm font-semibold text-green-500">Done</Text>
              </TouchableOpacity>
            </View>

            {/* Preview of selected date */}
            <View className="items-center py-3 border-b border-zinc-800/50">
              <Text className="text-lg font-bold text-white">
                {MONTHS[selectedMonth]} {selectedDay}, {selectedYear}
              </Text>
              <Text className="text-zinc-500 text-sm mt-0.5">
                {new Date(selectedYear, selectedMonth, selectedDay).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </Text>
            </View>

            {/* Columns */}
            <View className="relative flex-row px-4 py-2" style={{ height: 300 }}>
              {/* Gradient overlays for top and bottom */}
              <LinearGradient
                colors={["rgba(24,24,27,1)", "transparent"]}
                className="absolute top-0 z-10 h-12 rounded-t-lg left-4 right-4"
                pointerEvents="none"
              />
              <LinearGradient
                colors={["transparent", "rgba(24,24,27,1)"]}
                className="absolute bottom-0 z-10 h-12 rounded-b-lg left-4 right-4"
                pointerEvents="none"
              />

              {/* Highlight bar — centered in the scroll port below the header */}
              <View
                className="absolute z-10 rounded-full left-4 right-4 bg-green-500/10 border-y border-green-500/20"
                style={{
                  top: SCROLL_PORT_HEIGHT / 2 - ITEM_HEIGHT / 2 + SCROLL_HEADER_OFFSET,
                  height: ITEM_HEIGHT,
                }}
              />

              {/* Month Column */}
              <View className="items-center flex-1">
                <Text className="text-zinc-500 text-[10px] font-semibold mb-2 uppercase tracking-wider">
                  Month
                </Text>
                <ScrollView
                  ref={monthScrollRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(e) =>
                    handleScrollEnd(e, setSelectedMonth, MONTHS_DISPLAY, MONTHS)
                  }
                  onScrollEndDrag={(e) =>
                    handleDragEnd(e, setSelectedMonth, MONTHS_DISPLAY, MONTHS)
                  }
                  contentContainerStyle={{
                    paddingTop: SCROLL_PORT_HEIGHT / 2 - ITEM_HEIGHT / 2,
                    paddingBottom: SCROLL_PORT_HEIGHT / 2 - ITEM_HEIGHT / 2,
                  }}
                >
                  {MONTHS_DISPLAY.map((item, i) =>
                    item === null ? (
                      <View
                        key={`m-spacer-${i}`}
                        style={{ height: ITEM_HEIGHT }}
                      />
                    ) : (
                      <TouchableOpacity
                        key={item}
                        onPress={() => {
                          setSelectedMonth(i - SPACER_COUNT);
                          scrollToIndex(monthScrollRef, i);
                        }}
                        activeOpacity={0.6}
                        style={{ height: ITEM_HEIGHT }}
                        className="items-center justify-center"
                      >
                        <Text
                          className={`text-base ${
                            i - SPACER_COUNT === selectedMonth
                              ? "text-white font-bold"
                              : "text-zinc-600"
                          }`}
                        >
                          {item.substring(0, 3)}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </ScrollView>
              </View>

              {/* Day Column */}
              <View className="items-center flex-1">
                <Text className="text-zinc-500 text-[10px] font-semibold mb-2 uppercase tracking-wider">
                  Day
                </Text>
                <ScrollView
                  ref={dayScrollRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(e) =>
                    handleScrollEnd(
                      e,
                      (v) => setSelectedDay(v + 1),
                      daysDisplay,
                      days
                    )
                  }
                  onScrollEndDrag={(e) =>
                    handleDragEnd(
                      e,
                      (v) => setSelectedDay(v + 1),
                      daysDisplay,
                      days
                    )
                  }
                  contentContainerStyle={{
                    paddingTop: SCROLL_PORT_HEIGHT / 2 - ITEM_HEIGHT / 2,
                    paddingBottom: SCROLL_PORT_HEIGHT / 2 - ITEM_HEIGHT / 2,
                  }}
                >
                  {daysDisplay.map((item, i) =>
                    item === null ? (
                      <View
                        key={`d-spacer-${i}`}
                        style={{ height: ITEM_HEIGHT }}
                      />
                    ) : (
                      <TouchableOpacity
                        key={item}
                        onPress={() => {
                          setSelectedDay(item);
                          scrollToIndex(dayScrollRef, i);
                        }}
                        activeOpacity={0.6}
                        style={{ height: ITEM_HEIGHT }}
                        className="items-center justify-center"
                      >
                        <Text
                          className={`text-base ${
                            item === selectedDay
                              ? "text-white font-bold"
                              : "text-zinc-600"
                          }`}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </ScrollView>
              </View>

              {/* Year Column */}
              <View className="items-center flex-1">
                <Text className="text-zinc-500 text-[10px] font-semibold mb-2 uppercase tracking-wider">
                  Year
                </Text>
                <ScrollView
                  ref={yearScrollRef}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(e) =>
                    handleScrollEnd(
                      e,
                      (v) => setSelectedYear(years[v]),
                      YEARS_DISPLAY,
                      years
                    )
                  }
                  onScrollEndDrag={(e) =>
                    handleDragEnd(
                      e,
                      (v) => setSelectedYear(years[v]),
                      YEARS_DISPLAY,
                      years
                    )
                  }
                  contentContainerStyle={{
                    paddingTop: SCROLL_PORT_HEIGHT / 2 - ITEM_HEIGHT / 2,
                    paddingBottom: SCROLL_PORT_HEIGHT / 2 - ITEM_HEIGHT / 2,
                  }}
                >
                  {YEARS_DISPLAY.map((item, i) =>
                    item === null ? (
                      <View
                        key={`y-spacer-${i}`}
                        style={{ height: ITEM_HEIGHT }}
                      />
                    ) : (
                      <TouchableOpacity
                        key={item}
                        onPress={() => {
                          setSelectedYear(item);
                          scrollToIndex(yearScrollRef, i);
                        }}
                        activeOpacity={0.6}
                        style={{ height: ITEM_HEIGHT }}
                        className="items-center justify-center"
                      >
                        <Text
                          className={`text-base ${
                            item === selectedYear
                              ? "text-white font-bold"
                              : "text-zinc-600"
                          }`}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </ScrollView>
              </View>
            </View>

            {/* Bottom spacing */}
            <View className="h-6" />
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

export default DatePicker;
