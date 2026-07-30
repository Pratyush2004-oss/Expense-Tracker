import { USERLOGININPUTTYPE, USERSIGNUPINPUTTYPE, USERTYPE } from "@/types";
import { Alert } from "react-native";
import { create } from "zustand";
import axios, { AxiosError } from "axios"
import { BACKEND_API_URL } from "@/constants";
import storage from "@/storage";

const STORAGE_KEYS = {
    TOKEN: "auth_token",
    USER: "auth_user",
} as const;

interface USERSTOREINTERFACE {
    user: USERTYPE | null;
    token: string | null;
    isLoading: boolean;
    signup: ({ name, email, password }: USERSIGNUPINPUTTYPE) => Promise<void>;
    login: ({ email, password }: USERLOGININPUTTYPE) => Promise<void>;
    checkme: () => Promise<void>;
    logout: () => Promise<void>;
    loadStoredUser: () => Promise<void>;
}

export const useUserStore = create<USERSTOREINTERFACE>((set, get) => ({
    user: null,
    token: null,
    isLoading: true,

    /**
     * Restore user + token from AsyncStorage on app startup.
     * Called once in the root layout.
     */
    loadStoredUser: async () => {
        try {
            const [token, userJson] = await Promise.all([
                storage.getItem(STORAGE_KEYS.TOKEN),
                storage.getItem(STORAGE_KEYS.USER),
            ]);
            if (token && userJson) {
                set({ user: JSON.parse(userJson), token, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch {
            set({ isLoading: false });
        }
    },

    signup: async ({ name, email, password }) => {
        try {
            if (!name || !email || !password) {
                Alert.alert("Error", "All fields are required")
                return
            }
            //send request to backend
            const response = await axios.post(`${BACKEND_API_URL}/api/auth/signup`, {
                email, name, password
            })
            if (response.status === 400) throw new Error(response.data.message)

            // if everything goes right, persist token + user
            const { user, token } = response.data;
            await Promise.all([
                storage.setItem(STORAGE_KEYS.TOKEN, token),
                storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
            ]);

            set({ user, token })
            Alert.alert("Success", response.data.message || "User created successfully")

        } catch (error: any) {
            console.log(error)
            if (error instanceof AxiosError) {
                Alert.alert("Error", error.response?.data.message || "Internal Server Error")
            }
            else {
                Alert.alert("Error", error.message || "Something went wrong")
            }
        }

    },
    login: async ({ email, password }) => {
        try {
            if (!(email && password)) {
                Alert.alert("error", "all fields are required")
                return
            }
            // send request TO BACKEND
            const response = await axios.post(`${BACKEND_API_URL}/api/auth/login`, { email, password })
            if (response.status === 400) throw new Error(response.data.message)

            // if everything goes right, persist token + user
            const { user, token } = response.data;
            await Promise.all([
                storage.setItem(STORAGE_KEYS.TOKEN, token),
                storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
            ]);

            set({ user, token })
            Alert.alert("success", response.data.message)

        } catch (error: any) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data)
                Alert.alert("error", error.response?.data.message)
            }
            else {
                console.log(error)
                Alert.alert("error", error.message)

            }
        }
    },
    checkme: async () => {
        try {
            const { token } = get()
            if (!token) {
                return
            }
            //send request to backend
            const response = await axios.get(`${BACKEND_API_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            })
            if (response.status === 400) throw new Error(response.data.message)

            // if everything goes right, update stored user data
            const user = response.data.user;
            await storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            set({ user })

        } catch (error: any) {
            console.log(error);
            // Token might be expired — clear stored auth
            await storage.removeMany([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
            set({ user: null, token: null });
        }
    },
    logout: async () => {
        await storage.removeMany([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
        set({ user: null, token: null })
    }
}))