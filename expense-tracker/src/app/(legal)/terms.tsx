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

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using the Expense Tracker application (\"the App\"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the App.",
  },
  {
    title: "Description of Service",
    content:
      "The App provides personal expense tracking and financial management tools, including the ability to record, categorize, and analyze your income and expenses. The App is intended for personal, non-commercial use only.",
  },
  {
    title: "User Accounts",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account. You must be at least 13 years of age to use this service.",
  },
  {
    title: "User Responsibilities",
    content:
      "You agree to use the App only for lawful purposes and in accordance with these Terms. You agree not to:\n\n• Provide false or misleading information\n• Attempt to gain unauthorized access to the App or its systems\n• Use the App to violate any applicable laws or regulations\n• Interfere with or disrupt the integrity or performance of the App\n• Upload or transmit viruses or other malicious code",
  },
  {
    title: "Data Accuracy",
    content:
      "While we strive to maintain accurate records, the App is provided as a tool to assist you in tracking your finances. You are solely responsible for verifying the accuracy of the data you enter and any financial decisions you make based on that data.",
  },
  {
    title: "Intellectual Property",
    content:
      "The App and its original content, features, and functionality are owned by Expense Tracker and are protected by international copyright, trademark, and other intellectual property laws. You may not modify, reproduce, distribute, or create derivative works without our express written consent.",
  },
  {
    title: "Limitation of Liability",
    content:
      "Expense Tracker shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the App. This includes, but is not limited to, financial losses, data loss, or business interruption, even if we have been advised of the possibility of such damages.",
  },
  {
    title: "Disclaimer of Warranties",
    content:
      "The App is provided on an \"as is\" and \"as available\" basis without any warranties of any kind, either express or implied. We do not warrant that the App will be uninterrupted, error-free, secure, or free from viruses or other harmful components.",
  },
  {
    title: "Termination",
    content:
      "We reserve the right to terminate or suspend your account at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the App will immediately cease.",
  },
  {
    title: "Changes to Terms",
    content:
      "We reserve the right to modify these Terms at any time. We will notify you of any changes by updating the date at the top of these Terms. Your continued use of the App after any changes constitutes acceptance of the new Terms.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions about these Terms, please contact us at support@expensetracker.app.",
  },
];

const TermsScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
          Terms & Conditions
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* Last Updated */}
        <View className="px-5 pt-5 pb-3">
          <Text className="text-xs font-medium text-zinc-600">
            Last updated: July 31, 2026
          </Text>
        </View>

        {/* Sections */}
        <View className="px-5 gap-4">
          {SECTIONS.map((section, idx) => (
            <View
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
            >
              <Text className="text-base font-bold text-white mb-2">
                {section.title}
              </Text>
              <Text className="text-sm leading-6 text-zinc-400">
                {section.content}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsScreen;
