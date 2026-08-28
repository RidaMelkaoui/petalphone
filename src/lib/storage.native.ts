import 'expo-sqlite/localStorage/install';

const prefix = 'petalphone.v1.';

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(`${prefix}${key}`);
      return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T) {
    try {
      localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
    } catch {
      // The game stays playable even if a device cannot save a recent session.
    }
  },
};

