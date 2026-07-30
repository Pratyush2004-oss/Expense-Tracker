export type USERTYPE = {
    name: string,
    email: string,
    id: string,
    created_at: string
}

export type USERLOGININPUTTYPE = {
    email: string,
    password: string
}

export type USERSIGNUPINPUTTYPE = {
    email: string,
    password: string,
    name: string
}

export type ADDTRANSACTIONINPUTTYPE = {
    title: string,
    transaction_date: Date,
    amount: number,
    category: "Food" | "Transport" | "Entertainment" | "Health" | "Education" | "Salary" | "Refund" | "Freelance" | "Family" | "Business" | "Other",
    payment_method: 'Cash' | 'Debit Card' | 'Credit Card' | 'Net Banking' | 'UPI' | 'Other',
    transaction_type: "Income" | "Expense"
}

export type TRANSACTIONTYPE = {
    date: string,
    transactions : {
        id: string,
        title: string,
        transaction_date: Date,
        amount: number,
        category: "Food" | "Transport" | "Entertainment" | "Health" | "Education" | "Salary" | "Refund" | "Freelance" | "Family" | "Business" | "Other",
        payment_method: 'Cash' | 'Debit Card' | 'Credit Card' | 'Net Banking' | 'UPI' | 'Other',
        transaction_type: "Income" | "Expense",
        created_at: string,
        updated_at: string,
        user_id: string
    }[]
}

export type CategoryBreakdown = {
  category: string;
  amount: number;
  count: number;
  percentage: number;
};

export type SummaryType = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeCategories: CategoryBreakdown[];
  expenseCategories: CategoryBreakdown[];
};
