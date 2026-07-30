/**
 * Cross-platform storage adapter.
 *
 * - Native (iOS/Android): uses expo-secure-store (Keychain / encrypted prefs)
 * - Web: uses localStorage (expo-secure-store is not available on web)
 * - Fallback: in-memory Map if neither is available
 */
import { Platform } from "react-native";

interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  removeMany(keys: string[]): Promise<void>;
  clear(): Promise<void>;
}

/* ── Web implementation (localStorage) ────────────────────────────── */
function createWebStorage(): IStorage {
  return {
    getItem: async (key) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: async (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn("[Storage] setItem failed:", e);
      }
    },
    removeItem: async (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn("[Storage] removeItem failed:", e);
      }
    },
    removeMany: async (keys) => {
      try {
        keys.forEach((k) => localStorage.removeItem(k));
      } catch (e) {
        console.warn("[Storage] removeMany failed:", e);
      }
    },
    clear: async () => {
      try {
        localStorage.clear();
      } catch (e) {
        console.warn("[Storage] clear failed:", e);
      }
    },
  };
}

/* ── In-memory fallback ──────────────────────────────────────────── */
function createMemoryStorage(): IStorage {
  const store = new Map<string, string>();
  return {
    getItem: async (key) => store.get(key) ?? null,
    setItem: async (key, value) => {
      store.set(key, value);
    },
    removeItem: async (key) => {
      store.delete(key);
    },
    removeMany: async (keys) => {
      keys.forEach((k) => store.delete(k));
    },
    clear: async () => {
      store.clear();
    },
  };
}

/* ── Initialise once at module scope ──────────────────────────────── */
let storage: IStorage;

if (Platform.OS === "web") {
  // Web: use localStorage directly — no native modules needed
  storage = createWebStorage();
} else {
  // Native: use expo-secure-store (Keychain / encrypted shared prefs)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const SecureStore = require("expo-secure-store");
    if (SecureStore?.setItemAsync && SecureStore?.getItemAsync) {
      storage = {
        getItem: async (key) => {
          try {
            const value = await SecureStore.getItemAsync(key);
            return value ?? null;
          } catch {
            return null;
          }
        },
        setItem: async (key, value) => {
          try {
            await SecureStore.setItemAsync(key, value);
          } catch (e) {
            console.warn("[Storage] SecureStore setItemAsync failed:", e);
          }
        },
        removeItem: async (key) => {
          try {
            await SecureStore.deleteItemAsync(key);
          } catch (e) {
            console.warn("[Storage] SecureStore deleteItemAsync failed:", e);
          }
        },
        removeMany: async (keys) => {
          await Promise.all(
            keys.map(async (k) => {
              try {
                await SecureStore.deleteItemAsync(k);
              } catch (e) {
                console.warn(
                  "[Storage] SecureStore deleteItemAsync failed:",
                  e
                );
              }
            })
          );
        },
        clear: async () => {
          // SecureStore does not have a clear-all API, so we
          // rely on removing specific keys via removeMany.
          const knownKeys = ["auth_token", "auth_user"];
          await Promise.all(
            knownKeys.map(async (k) => {
              try {
                await SecureStore.deleteItemAsync(k);
              } catch {
                // ignore
              }
            })
          );
        },
      };
    } else {
      storage = createMemoryStorage();
    }
  } catch {
    console.warn(
      "[Storage] expo-secure-store not available, falling back to in-memory"
    );
    storage = createMemoryStorage();
  }
}

export default storage;
