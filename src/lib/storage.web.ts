const prefix = 'petalphone.v1.';

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const stored = window.localStorage.getItem(`${prefix}${key}`);
      return stored ? (JSON.parse(stored) as T) : fallback;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T) {
    try {
      window.localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
    } catch {
      // Browser previews should stay playable when storage is unavailable.
    }
  },
};

