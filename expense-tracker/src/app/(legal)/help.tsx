import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Keyboard,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const FAQS = [
  {
    question: "How do I add a new transaction?",
    answer:
      "Tap the '+' button on the Home screen or use the Transactions tab. Fill in the title, amount, category, payment method, and date, then tap Save. Your transaction will appear instantly in the list and charts.",
  },
  {
    question: "How do I edit or delete a transaction?",
    answer:
      "Open the Transactions tab and tap on any transaction to edit it. To delete, tap the trash icon on the transaction. You'll be asked to confirm before the transaction is permanently removed.",
  },
  {
    question: "How do I change the month I'm viewing?",
    answer:
      "On the Home and Transactions screens, tap the month/year selector at the top to open a picker. Choose the month and year you want to view — all data and charts will update to show that month.",
  },
  {
    question: "Why are my analytics showing ₹0?",
    answer:
      "Analytics only reflect transactions recorded for the currently selected month. Make sure you've added transactions for that month, and pull down to refresh the analytics screen.",
  },
  {
    question: "Can I change my password?",
    answer:
      "Password changes are handled through the account settings. If you forgot your password, use the 'Forgot Password?' link on the login screen to reset it.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Yes. Your data is stored on encrypted servers, and your password is hashed — never stored in plain text. We never sell or share your financial information with third parties. See our Privacy Policy for full details.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "Contact us at support@expensetracker.app from your registered email address, and we'll process the deletion within 30 days. All associated data will be permanently removed.",
  },
  {
    question: "How do I report a bug or suggest a feature?",
    answer:
      "We'd love to hear from you! Email us at support@expensetracker.app with a description of the issue or your feature suggestion. Please include your device model and app version to help us investigate.",
  },
];

const CONTACT_OPTIONS = [
  {
    icon: "mail-outline" as const,
    label: "Email Support",
    value: "support@expensetracker.app",
    color: "#22C55E",
  },
  {
    icon: "chatbubble-ellipses-outline" as const,
    label: "Live Chat",
    value: "Available 10 AM – 6 PM IST",
    color: "#3B82F6",
  },
  {
    icon: "time-outline" as const,
    label: "Response Time",
    value: "Within 24 hours",
    color: "#F59E0B",
  },
];

const HelpScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return FAQS;
    return FAQS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-black">
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
          Help Center
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* Hero */}
        <View className="px-6 pt-8 pb-4 items-center">
          <View className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 items-center justify-center mb-4">
            <Ionicons name="help-circle-outline" size={32} color="#06B6D4" />
          </View>
          <Text className="text-xl font-bold text-white">How can we help?</Text>
          <Text className="mt-1.5 text-sm text-zinc-500 text-center">
            Browse common questions or reach out to our support team.
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 h-12">
            <Ionicons name="search-outline" size={18} color="#52525B" />
            <TextInput
              className="flex-1 ml-3 text-sm text-white"
              placeholder="Search questions..."
              placeholderTextColor="#52525B"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setOpenIndex(null);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              keyboardAppearance="dark"
              selectionColor="#22C55E"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setOpenIndex(null);
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={18} color="#52525B" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Contact Options */}
        <View className="px-5 mb-6 gap-3">
          {CONTACT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.label}
              activeOpacity={0.7}
              className="flex-row items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
              onPress={() => {
                if (option.label === "Email Support") {
                  Linking.openURL("mailto:support@expensetracker.app");
                }
              }}
            >
              <View
                className="items-center justify-center rounded-xl w-11 h-11"
                style={{ backgroundColor: `${option.color}15` }}
              >
                <Ionicons name={option.icon} size={22} color={option.color} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-white">
                  {option.label}
                </Text>
                <Text className="mt-0.5 text-xs text-zinc-500">
                  {option.value}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#52525B" />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <View className="px-5">
          <Text className="mb-3 ml-1 text-xs font-semibold tracking-wider uppercase text-zinc-500">
            Frequently Asked Questions
          </Text>
          {filteredFAQs.length > 0 ? (
            <View className="gap-3">
              {filteredFAQs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <View
                    key={idx}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      className="flex-row items-center px-5 py-4"
                      onPress={() => {
                        Keyboard.dismiss();
                        setOpenIndex(isOpen ? null : idx);
                      }}
                    >
                      <Text className="flex-1 text-sm font-semibold text-white pr-3">
                        {faq.question}
                      </Text>
                      <Ionicons
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={16}
                        color="#52525B"
                      />
                    </TouchableOpacity>
                    {isOpen && (
                      <View className="px-5 pb-4">
                        <Text className="text-sm leading-6 text-zinc-400">
                          {faq.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="items-center justify-center py-10 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <Ionicons name="search-outline" size={28} color="#3F3F46" />
              <Text className="mt-3 text-sm text-zinc-500">
                No results found
              </Text>
              <Text className="mt-1 text-xs text-zinc-600">
                Try a different keyword or phrase
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpScreen;
