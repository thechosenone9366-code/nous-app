import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch {}
  },
};

export const STORAGE_KEYS = {
  COUPLE_INFO: 'couple_info',
  MESSAGES: 'messages',
  EVENTS: 'events',
  PHOTOS: 'photos',
  MOOD: 'mood',
  DAILY_QUESTION_INDEX: 'daily_question_index',
  QUIZ_SCORES: 'quiz_scores',
} as const;
