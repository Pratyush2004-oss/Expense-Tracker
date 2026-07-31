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
    title: "Information We Collect",
    content:
      "We collect information you provide directly to us when you create an account, including your name, email address, and password. We also collect financial data that you voluntarily enter into the App, such as transaction amounts, categories, payment methods, and dates.",
  },
  {
    title: "How We Use Your Information",
    content:
      "The information we collect is used solely to provide and improve our expense tracking service. This includes:\n\n• Displaying your financial data within the App\n• Generating reports, charts, and analytics based on your data\n• Syncing your data across devices when you log in\n• Sending essential service-related communications\n• Improving the App's features and user experience",
  },
  {
    title: "Data Storage & Security",
    content:
      "Your data is stored securely on our servers using industry-standard encryption protocols. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your password is hashed and never stored in plain text.",
  },
  {
    title: "Data Sharing",
    content:
      "We do not sell, trade, or rent your personal information to third parties. We do not share your financial data with advertisers, marketers, or any external services. We may disclose your information only if required to do so by law or to protect our legal rights.",
  },
  {
    title: "Data Retention",
    content:
      "We retain your personal information for as long as your account remains active. If you delete your account, your data will be permanently removed from our systems within 30 days. Backup copies may be retained for up to 90 days for disaster recovery purposes.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to:\n\n• Access and review the personal data we hold about you\n• Correct any inaccurate or incomplete data\n• Delete your account and associated data\n• Export your data in a portable format\n• Withdraw consent at any time, where processing is based on consent\n\nTo exercise any of these rights, please contact us at support@expensetracker.app.",
  },
  {
    title: "Cookies & Tracking",
    content:
      "We use essential cookies and similar technologies to maintain your session and keep you logged in. We do not use tracking cookies, analytics cookies, or any form of behavioral tracking. You can control cookie preferences through your device settings.",
  },
  {
    title: "Third-Party Services",
    content:
      "The App may contain links to third-party services or websites. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.",
  },
  {
    title: "Children's Privacy",
    content:
      "The App is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately and we will take steps to delete such information.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of material changes by updating the date at the top of this page and, where appropriate, through in-app notifications. Your continued use of the App after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:\n\nEmail: support@expensetracker.app\nAddress: 123 Finance Street, Mumbai, India",
  },
];

const PrivacyScreen = () => {
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
          Privacy Policy
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

export default PrivacyScreen;
