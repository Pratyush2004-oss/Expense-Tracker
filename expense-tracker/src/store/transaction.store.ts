import { ADDTRANSACTIONINPUTTYPE, TRANSACTIONTYPE } from "@/types";
import { Alert } from "react-native";
import { create } from "zustand";
import { useUserStore } from "./user.store";
import { BACKEND_API_URL } from "@/constants";
import axios, { AxiosError } from "axios";

interface TRANSACTIONSTORE {
    transactions: TRANSACTIONTYPE[],
    year_month: string,
    isFetching: boolean,
    setYear_month: (year_month: string) => void
    addTransaction: (input: ADDTRANSACTIONINPUTTYPE) => Promise<void>
    fetchTransaction: () => Promise<void>;
    updateTransaction: (transaction_id: string, input: ADDTRANSACTIONINPUTTYPE) => Promise<void>;
    deleteTransaction: (transaction_id: string) => Promise<void>
}

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();

export const useTransactionStore = create<TRANSACTIONSTORE>((set, get) => ({
    transactions: [],
    isFetching: false,
    year_month: `${CURRENT_YEAR}-${CURRENT_MONTH + 1}`,
    setYear_month: (year_month) => set({ year_month }),
    addTransaction: async (input) => {
        try {
            // check for inputs
            if (!(input.title && input.amount && input.transaction_date && input.category && input.transaction_type && input.payment_method)) {
                Alert.alert("Error", "All fields are required")
                return
            }
            // check for valid amount
            if (isNaN(Number(input.amount)) || Number(input.amount) <= 0) {
                Alert.alert("Error", "Enter a valid amount")
                return
            }
            // check for token 
            const token = useUserStore.getState().token;
            if (!token) {
                return;
            }
            // send request to backend
            const response = await axios.post(`${BACKEND_API_URL}/api/transaction/add`, input, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 400) throw new Error(response.data.message)
            // if everything goes right, call the fetch transaction function

            get().fetchTransaction()
        } catch (error: any) {
            console.log(error);
            if (error instanceof AxiosError) {
                Alert.alert("Error", error.response?.data.message)
            }
            else {
                Alert.alert("Error", error.message)
            }
        }

    },
    fetchTransaction: async () => {
        try {
            set({ isFetching: true })
            // check for token
            const token = useUserStore.getState().token;
            if (!token) {
                return;
            }
            const { year_month } = get();
            // check for valid year and month
            const [year, month] = year_month.split("-");
            if (isNaN(Number(year)) || isNaN(Number(month)) || Number(year) < 2000 || Number(year) > 2119 || Number(month) < 1 || Number(month) > 12) {
                Alert.alert("Error", "Enter a valid year and month")
                return
            }
            // send request to backend
            const response = await axios.get(`${BACKEND_API_URL}/api/transaction/fetch/${year_month}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 400) throw new Error(response.data.message)
            set({ transactions: response.data.groupedTransactions })
        } catch (error) {
            console.log(error)
        }
        finally {
            set({ isFetching: false })
        }
    },
    updateTransaction: async (transaction_id, input) => {
        try {
            // check for inputs
            if (!(input.title && input.amount && input.transaction_date && input.category && input.transaction_type && input.payment_method)) {
                Alert.alert("Error", "All fields are required")
                return
            }
            // check for valid amount
            if (isNaN(Number(input.amount)) || Number(input.amount) <= 0) {
                Alert.alert("Error", "Enter a valid amount")
                return
            }
            // check for token 
            const token = useUserStore.getState().token;
            if (!token) {
                return;
            }
            // send request to backend
            const response = await axios.put(`${BACKEND_API_URL}/api/transaction/update/${transaction_id}`, input, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 400) throw new Error(response.data.message)
            // if everything goes right, call the fetch transaction function
            get().fetchTransaction()
        } catch (error: any) {
            console.log(error);
            if (error instanceof AxiosError) {
                Alert.alert("Error", error.response?.data.message)
            }
            else {
                Alert.alert("Error", error.message)
            }
        }

    },
    deleteTransaction: async (transaction_id) => {
        try {
            // check for token 
            const token = useUserStore.getState().token;
            if (!token) {
                return;
            }
            // send request to backend
            const response = await axios.delete(`${BACKEND_API_URL}/api/transaction/delete/${transaction_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 400) throw new Error(response.data.message)
            // if everything goes right, call the fetch transaction function
            get().fetchTransaction()
        } catch (error: any) {
            console.log(error);
            if (error instanceof AxiosError) {
                Alert.alert("Error", error.response?.data.message)
            }
            else {
                Alert.alert("Error", error.message)
            }
        }
    }
}))