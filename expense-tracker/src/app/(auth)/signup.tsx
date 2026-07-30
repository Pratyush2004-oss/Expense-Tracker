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
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/user.store";

const SignupScreen = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const {signup} = useUserStore()

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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

  const handleSignup = async () => {
    if (!validate()) return;
    if (!agreeTerms) return;
    Keyboard.dismiss();
    setLoading(true);

    // Await the signup so the API call completes before navigating
    await signup({
      email,
      name,
      password,
    });

    // Check if the user was actually set (signup succeeded)
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="justify-center flex-1 px-6 py-10">
            {/* Logo / Brand Area */}
            <View className="items-center mb-8">
              <View className="items-center justify-center w-20 h-20 mb-4 border rounded-2xl bg-green-500/10 border-green-500/20">
                <Ionicons
                  name="person-add-outline"
                  size={40}
                  color="#22C55E"
                />
              </View>
              <Text className="text-3xl font-bold tracking-tight text-white">
                Create Account
              </Text>
              <Text className="mt-2 text-base text-zinc-400">
                Join us and start budgeting
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              {/* Name Input */}
              <View>
                <Text className="mb-2 ml-1 text-sm font-medium text-zinc-400">
                  Full Name
                </Text>
                <View
                  className={`flex-row items-center bg-zinc-900 border rounded-xl px-4 h-14 ${
                    errors.name ? "border-red-500" : "border-zinc-800"
                  }`}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={errors.name ? "#EF4444" : "#22C55E"}
                  />
                  <TextInput
                    className="flex-1 ml-3 text-base text-white"
                    placeholder="John Doe"
                    placeholderTextColor="#52525B"
                    value={name}
                    onChangeText={(t) => {
                      setName(t);
                      if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                    }}
                    autoCapitalize="words"
                    autoCorrect={false}
                    editable={!loading}
                  />
                </View>
                {errors.name && (
                  <Text className="text-red-400 text-xs mt-1.5 ml-1">
                    {errors.name}
                  </Text>
                )}
              </View>

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
                      if (errors.email)
                        setErrors((p) => ({ ...p, email: "" }));
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

              {/* Terms & Conditions */}
              <TouchableOpacity
                className="flex-row items-start mt-1"
                onPress={() => setAgreeTerms(!agreeTerms)}
                activeOpacity={0.7}
              >
                <View
                  className={`w-5 h-5 rounded-md border-2 items-center justify-center mt-0.5 ${
                    agreeTerms
                      ? "bg-green-500 border-green-500"
                      : "border-zinc-600"
                  }`}
                >
                  {agreeTerms && (
                    <Ionicons name="checkmark" size={14} color="black" />
                  )}
                </View>
                <Text className="flex-1 ml-3 text-sm text-zinc-400">
                  I agree to the{" "}
                  <Text className="font-medium text-green-500">
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text className="font-medium text-green-500">
                    Privacy Policy
                  </Text>
                </Text>
              </TouchableOpacity>

              {/* Signup Button */}
              <TouchableOpacity
                className={`h-14 rounded-xl items-center justify-center mt-2 ${
                  agreeTerms ? "bg-green-500" : "bg-zinc-800"
                } ${loading ? "opacity-70" : ""}`}
                onPress={handleSignup}
                activeOpacity={0.8}
                disabled={loading || !agreeTerms}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Text
                    className={`font-bold text-base ${
                      agreeTerms ? "text-black" : "text-zinc-500"
                    }`}
                  >
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View className="flex-row items-center justify-center mt-8">
              <Text className="text-sm text-zinc-500">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)")}
                activeOpacity={0.7}
              >
                <Text className="text-sm font-semibold text-green-500">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;