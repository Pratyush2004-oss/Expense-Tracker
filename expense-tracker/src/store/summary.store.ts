import { create } from "zustand";
import { CategoryBreakdown, SummaryType, TRANSACTIONTYPE } from "@/types";
import { useTransactionStore } from "./transaction.store";

const CATEGORY_NAMES: string[] = [
  "Food", "Transport", "Entertainment", "Health", "Education",
  "Salary", "Refund", "Freelance", "Family", "Other",
];

interface SUMMARYSTORE {
  summary: SummaryType;
  computeSummary: () => void;
}

const emptyCategoryMap = (): Record<string, { amount: number; count: number }> => {
  const map: Record<string, { amount: number; count: number }> = {};
  for (const cat of CATEGORY_NAMES) {
    map[cat] = { amount: 0, count: 0 };
  }
  return map;
};

const computeCategoryBreakdown = (
  categoryMap: Record<string, { amount: number; count: number }>,
  total: number
): CategoryBreakdown[] => {
  return Object.entries(categoryMap)
    .filter(([, v]) => v.count > 0)
    .map(([category, v]) => ({
      category,
      amount: v.amount,
      count: v.count,
      percentage: total > 0 ? Math.round((v.amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

const buildSummary = (transactions: TRANSACTIONTYPE[]): SummaryType => {
  let totalIncome = 0;
  let totalExpense = 0;
  const incomeMap = emptyCategoryMap();
  const expenseMap = emptyCategoryMap();

  if (!Array.isArray(transactions)) {
    return { totalIncome: 0, totalExpense: 0, balance: 0, incomeCategories: [], expenseCategories: [] };
  }

  for (const day of transactions) {
    if (!day?.transactions || !Array.isArray(day.transactions)) continue;
    for (const tx of day.transactions) {
      const amount = Number(tx.amount);
      if (tx.transaction_type === "Income") {
        totalIncome += amount;
        if (incomeMap[tx.category]) {
          incomeMap[tx.category].amount += amount;
          incomeMap[tx.category].count += 1;
        }
      } else {
        totalExpense += amount;
        if (expenseMap[tx.category]) {
          expenseMap[tx.category].amount += amount;
          expenseMap[tx.category].count += 1;
        }
      }
    }
  }

  return {
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalExpense: Math.round(totalExpense * 100) / 100,
    balance: Math.round((totalIncome - totalExpense) * 100) / 100,
    incomeCategories: computeCategoryBreakdown(incomeMap, totalIncome),
    expenseCategories: computeCategoryBreakdown(expenseMap, totalExpense),
  };
};

export const useSummaryStore = create<SUMMARYSTORE>((set) => ({
  summary: {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    incomeCategories: [],
    expenseCategories: [],
  },

  computeSummary: () => {
    const transactions = useTransactionStore.getState().transactions;
    const summary = buildSummary(transactions);
    set({ summary });
  },
}));

// Auto-compute summary whenever the transaction store changes
useTransactionStore.subscribe(() => {
  useSummaryStore.getState().computeSummary();
});
