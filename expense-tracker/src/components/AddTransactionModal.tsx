import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DatePicker from "./DatePicker";
import { useTransactionStore } from "@/store/transaction.store";
import { ADDTRANSACTIONINPUTTYPE, TRANSACTIONTYPE } from "@/types";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  editTransaction?: TRANSACTIONTYPE['transactions'][number];
}

const INCOME_CATEGORIES: ADDTRANSACTIONINPUTTYPE["category"][] = [
  "Salary",
  "Family",
  "Refund",
  "Freelance",
  "Other",
];

const EXPENSE_CATEGORIES: ADDTRANSACTIONINPUTTYPE["category"][] = [
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

const PAYMENT_METHODS: ADDTRANSACTIONINPUTTYPE["payment_method"][] = [
  "Cash",
  "Debit Card",
  "Credit Card",
  "Net Banking",
  "UPI",
  "Other",
];

const PAYMENT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Cash: "cash-outline",
  "Debit Card": "card-outline",
  "Credit Card": "card-outline",
  "Net Banking": "business-outline",
  UPI: "phone-portrait-outline",
  Other: "ellipsis-horizontal-outline",
};

type FormData = {
  title: string;
  amount: string;
  transaction_date: Date;
  category: ADDTRANSACTIONINPUTTYPE["category"];
  payment_method: ADDTRANSACTIONINPUTTYPE["payment_method"];
  transaction_type: ADDTRANSACTIONINPUTTYPE["transaction_type"];
};

type FormErrors = {
  title?: string;
  amount?: string;
};

const createDefaultForm = (): FormData => ({
  title: "",
  amount: "",
  transaction_date: new Date(),
  category: "Food",
  payment_method: "Cash",
  transaction_type: "Expense",
});

const formFromTransaction = (tx: NonNullable<AddTransactionModalProps['editTransaction']>): FormData => ({
  title: tx.title,
  amount: String(tx.amount),
  transaction_date: new Date(tx.transaction_date),
  category: tx.category as ADDTRANSACTIONINPUTTYPE['category'],
  payment_method: tx.payment_method as ADDTRANSACTIONINPUTTYPE['payment_method'],
  transaction_type: tx.transaction_type as ADDTRANSACTIONINPUTTYPE['transaction_type'],
});

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  editTransaction,
}) => {
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const updateTransaction = useTransactionStore((s) => s.updateTransaction);
  const isEditing = !!editTransaction;
  const [formData, setFormData] = useState<FormData>(
    editTransaction ? formFromTransaction(editTransaction) : createDefaultForm()
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [isLoading, setisLoading] = useState(false);
  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };

      // When switching transaction type, reset category if it doesn't belong
      if (key === "transaction_type") {
        const validCategories =
          value === "Income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        if (!validCategories.includes(next.category)) {
          next.category = validCategories[0];
        }
      }

      return next;
    });
  };

  // Reset form when modal opens/closes or editTransaction changes
  React.useEffect(() => {
    if (visible) {
      setFormData(
        editTransaction ? formFromTransaction(editTransaction) : createDefaultForm()
      );
      setFormErrors({});
    }
  }, [visible, editTransaction]);

  const handleSubmit = async () => {
    Keyboard.dismiss();

    // Validate
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (
      !formData.amount.trim() ||
      isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    )
      newErrors.amount = "Enter a valid amount";

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    const payload: ADDTRANSACTIONINPUTTYPE = {
      title: formData.title.trim(),
      amount: Number(formData.amount),
      transaction_date: formData.transaction_date,
      category: formData.category,
      payment_method: formData.payment_method,
      transaction_type: formData.transaction_type,
    };

    try {
      setisLoading(true);
      if (isEditing && editTransaction) {
        await updateTransaction(editTransaction.id, payload);
      } else {
        await addTransaction(payload);
      }
      setFormData(createDefaultForm());
      onClose();
    } catch {
    }
    finally {
      setisLoading(false);
    }
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setFormErrors({});
    setFormData(createDefaultForm());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="justify-end flex-1 bg-black/60">
            <TouchableWithoutFeedback onPress={() => { }}>
              <View
                className="border-t bg-zinc-900 rounded-t-3xl border-zinc-800"
                style={{ maxHeight: "90%" }}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                >
                  <View className="px-6 pt-6 pb-10">
                    {/* Handle */}
                    <View className="self-center w-12 h-1 mb-6 rounded-full bg-zinc-700" />

                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6">
                      <Text className="text-xl font-bold text-white">
                        {isEditing ? "Edit Transaction" : "Add Transaction"}
                      </Text>
                      <TouchableOpacity
                        onPress={handleClose}
                        className="items-center justify-center w-8 h-8 rounded-full bg-zinc-800"
                      >
                        <Ionicons name="close" size={18} color="#A1A1AA" />
                      </TouchableOpacity>
                    </View>

                    {/* Form fields */}
                    <View className="gap-5">
                      {/* ── Type Toggle ── */}
                      <View>
                        <Text className="mb-2 ml-1 text-xs font-medium text-zinc-400">
                          TYPE
                        </Text>
                        <View className="flex-row p-1 bg-zinc-800 rounded-xl">
                          <TouchableOpacity
                            onPress={() =>
                              updateField("transaction_type", "Expense")
                            }
                            className={`flex-1 py-3 rounded-lg items-center flex-row justify-center gap-2 ${formData.transaction_type === "Expense"
                              ? "bg-red-500/20"
                              : ""
                              }`}
                          >
                            <View
                              className={`w-2 h-2 rounded-full ${formData.transaction_type === "Expense"
                                ? "bg-red-400"
                                : "bg-zinc-600"
                                }`}
                            />
                            <Text
                              className={`font-semibold text-sm ${formData.transaction_type === "Expense"
                                ? "text-red-400"
                                : "text-zinc-500"
                                }`}
                            >
                              Expense
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              updateField("transaction_type", "Income")
                            }
                            className={`flex-1 py-3 rounded-lg items-center flex-row justify-center gap-2 ${formData.transaction_type === "Income"
                              ? "bg-green-500/20"
                              : ""
                              }`}
                          >
                            <View
                              className={`w-2 h-2 rounded-full ${formData.transaction_type === "Income"
                                ? "bg-green-400"
                                : "bg-zinc-600"
                                }`}
                            />
                            <Text
                              className={`font-semibold text-sm ${formData.transaction_type === "Income"
                                ? "text-green-400"
                                : "text-zinc-500"
                                }`}
                            >
                              Income
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* ── Title ── */}
                      <View>
                        <Text className="mb-2 ml-1 text-xs font-medium text-zinc-400">
                          TITLE
                        </Text>
                        <View
                          className={`flex-row items-center bg-zinc-800 border rounded-xl px-4 h-12 ${formErrors.title
                            ? "border-red-500"
                            : "border-zinc-700"
                            }`}
                        >
                          <Ionicons
                            name="text-outline"
                            size={18}
                            color={formErrors.title ? "#EF4444" : "#71717A"}
                          />
                          <TextInput
                            className="flex-1 ml-3 text-base text-white"
                            placeholder="Coffee, Groceries..."
                            placeholderTextColor="#52525B"
                            value={formData.title}
                            onChangeText={(t) => {
                              updateField("title", t);
                              if (formErrors.title)
                                setFormErrors((p) => ({ ...p, title: "" }));
                            }}
                          />
                        </View>
                        {formErrors.title && (
                          <Text className="text-red-400 text-xs mt-1.5 ml-1">
                            {formErrors.title}
                          </Text>
                        )}
                      </View>

                      {/* ── Amount ── */}
                      <View>
                        <Text className="mb-2 ml-1 text-xs font-medium text-zinc-400">
                          AMOUNT
                        </Text>
                        <View
                          className={`flex-row items-center bg-zinc-800 border rounded-xl px-4 h-12 ${formErrors.amount
                            ? "border-red-500"
                            : "border-zinc-700"
                            }`}
                        >
                          <Ionicons
                            name="cash-outline"
                            size={18}
                            color={formErrors.amount ? "#EF4444" : "#71717A"}
                          />
                          <TextInput
                            className="flex-1 ml-3 text-base text-white"
                            placeholder="0.00"
                            placeholderTextColor="#52525B"
                            value={formData.amount}
                            onChangeText={(t) => {
                              updateField("amount", t);
                              if (formErrors.amount)
                                setFormErrors((p) => ({ ...p, amount: "" }));
                            }}
                            keyboardType="decimal-pad"
                          />
                        </View>
                        {formErrors.amount && (
                          <Text className="text-red-400 text-xs mt-1.5 ml-1">
                            {formErrors.amount}
                          </Text>
                        )}
                      </View>

                      {/* ── Date Picker ── */}
                      <DatePicker
                        date={formData.transaction_date}
                        onDateChange={(d) => updateField("transaction_date", d)}
                        label="DATE"
                      />

                      {/* ── Category ── */}
                      <View>
                        <View className="flex-row items-center justify-between mx-1 mb-2">
                          <Text className="text-xs font-medium text-zinc-400">
                            CATEGORY
                          </Text>
                          <View
                            className={`flex-row items-center gap-1.5 px-2 py-0.5 rounded-full ${formData.transaction_type === "Income"
                              ? "bg-green-500/10"
                              : "bg-red-500/10"
                              }`}
                          >
                            <View
                              className={`w-1.5 h-1.5 rounded-full ${formData.transaction_type === "Income"
                                ? "bg-green-400"
                                : "bg-red-400"
                                }`}
                            />
                            <Text
                              className={`text-[10px] font-semibold uppercase tracking-wider ${formData.transaction_type === "Income"
                                ? "text-green-400"
                                : "text-red-400"
                                }`}
                            >
                              {formData.transaction_type}
                            </Text>
                          </View>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <View className="flex-row gap-2">
                            {(formData.transaction_type === "Income"
                              ? INCOME_CATEGORIES
                              : EXPENSE_CATEGORIES
                            ).map((cat) => (
                              <TouchableOpacity
                                key={cat}
                                onPress={() => updateField("category", cat)}
                                className={`px-4 py-2.5 rounded-full border ${formData.category === cat
                                  ? "bg-green-500/20 border-green-500/40"
                                  : "bg-zinc-800 border-zinc-700"
                                  }`}
                              >
                                <Text
                                  className={`text-sm font-medium ${formData.category === cat
                                    ? "text-green-400"
                                    : "text-zinc-400"
                                    }`}
                                >
                                  {cat}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </ScrollView>
                      </View>

                      {/* ── Payment Method ── */}
                      <View>
                        <Text className="mb-2 ml-1 text-xs font-medium text-zinc-400">
                          PAYMENT METHOD
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                          {PAYMENT_METHODS.map((method) => {
                            const isSelected = formData.payment_method === method;
                            return (
                              <TouchableOpacity
                                key={method}
                                onPress={() => updateField("payment_method", method)}
                                activeOpacity={0.7}
                                className={`flex-row items-center gap-2 px-4 py-2.5 rounded-xl border ${isSelected
                                  ? "bg-green-500/20 border-green-500/40"
                                  : "bg-zinc-800 border-zinc-700"
                                  }`}
                              >
                                <Ionicons
                                  name={PAYMENT_ICONS[method] || "ellipsis-horizontal"}
                                  size={16}
                                  color={isSelected ? "#22C55E" : "#71717A"}
                                />
                                <Text
                                  className={`text-sm font-medium ${isSelected ? "text-green-400" : "text-zinc-400"
                                    }`}
                                >
                                  {method}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>

                      {/* ── Summary Card ── */}
                      {formData.title && formData.amount && (
                        <View className="p-4 mt-1 border bg-zinc-800/50 border-zinc-700/50 rounded-xl">
                          <Text className="mb-2 text-xs font-medium tracking-wider uppercase text-zinc-500">
                            Summary
                          </Text>
                          <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                              <Text className="text-base font-semibold text-white">
                                {formData.title}
                              </Text>
                              <Text className="text-zinc-500 text-xs mt-0.5">
                                {formData.category} • {formData.payment_method} •{" "}
                                {formData.transaction_date.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </Text>
                            </View>
                            <Text
                              className={`text-lg font-bold ${formData.transaction_type === "Income"
                                ? "text-green-400"
                                : "text-red-400"
                                }`}
                            >
                              {formData.transaction_type === "Income" ? "+" : "-"}₹
                              {Number(formData.amount).toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* ── Submit ── */}
                      <TouchableOpacity
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        className="items-center justify-center mt-2 mb-4 overflow-hidden h-14 rounded-xl"
                        disabled={isLoading}
                      >
                        <LinearGradient
                          colors={["#22C55E", "#16A34A"]}
                          className="absolute inset-0"
                          style={{ position: "absolute", inset: 0 }}
                        />
                        {
                          isLoading ? <ActivityIndicator size="small" color="#fff" /> :
                            <Text className="text-base font-bold text-gray-100">
                              {isEditing ? "Update Transaction" : "Add Transaction"}
                            </Text>
                        }
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddTransactionModal;
