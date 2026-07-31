import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/user.store";

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    Keyboard.dismiss();
    setLoading(true);

    await login({ email: email.trim().toLowerCase(), password });

    // The store handles errors internally (shows Alert), so we check if
    // the user was actually set before navigating
    const currentUser = useUserStore.getState().user;
    if (currentUser) {
      router.replace("/(tabs)");
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="justify-center flex-1 px-6">
          {/* Logo / Brand Area */}
          <View className="items-center mb-10">
            <View className="items-center justify-center w-20 h-20 mb-4 border rounded-2xl bg-green-500/10 border-green-500/20">
              <Ionicons name="wallet-outline" size={40} color="#22C55E" />
            </View>
            <Text className="text-3xl font-bold tracking-tight text-white">
              Welcome Back
            </Text>
            <Text className="mt-2 text-base text-zinc-400">
              Sign in to track your expenses
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Email Input */}
            <View>
              <Text className="mb-2 ml-1 text-sm font-medium text-zinc-400">
                Email Address
              </Text>
              <View
                className={`flex-row items-center bg-zinc-900 border rounded-xl px-4 h-14 ${
                  errors.email ? "border-red-500" : "border-zinc-800"
                }`}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={errors.email ? "#EF4444" : "#22C55E"}
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-white"
                  placeholder="you@example.com"
                  placeholderTextColor="#52525B"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
              {errors.email && (
                <Text className="text-red-400 text-xs mt-1.5 ml-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View>
              <Text className="mb-2 ml-1 text-sm font-medium text-zinc-400">
                Password
              </Text>
              <View
                className={`flex-row items-center bg-zinc-900 border rounded-xl px-4 h-14 ${
                  errors.password ? "border-red-500" : "border-zinc-800"
                }`}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={errors.password ? "#EF4444" : "#22C55E"}
                />
                <TextInput
                  className="flex-1 ml-3 text-base text-white"
                  placeholder="••••••••"
                  placeholderTextColor="#52525B"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (errors.password)
                      setErrors((p) => ({ ...p, password: "" }));
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#71717A"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-400 text-xs mt-1.5 ml-1">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="self-end" activeOpacity={0.7}>
              <Text className="text-sm font-medium text-green-500">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              className={`h-14 rounded-xl bg-green-500 items-center justify-center mt-2 ${
                loading ? "opacity-70" : ""
              }`}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <Text className="text-base font-bold text-black">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Signup Link */}
          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-sm text-zinc-500">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/signup")}
              activeOpacity={0.7}
            >
              <Text className="text-sm font-semibold text-green-500">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Legal Links */}
          <View className="flex-row items-center justify-center mt-6 gap-3">
            <TouchableOpacity
              onPress={() => router.push("/(legal)/terms")}
              activeOpacity={0.7}
            >
              <Text className="text-xs text-zinc-600 underline">
                Terms & Conditions
              </Text>
            </TouchableOpacity>
            <Text className="text-xs text-zinc-700">|</Text>
            <TouchableOpacity
              onPress={() => router.push("/(legal)/privacy")}
              activeOpacity={0.7}
            >
              <Text className="text-xs text-zinc-600 underline">
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;