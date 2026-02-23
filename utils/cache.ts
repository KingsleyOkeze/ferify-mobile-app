import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheData<T> {
    data: T;
    timestamp: number;
}

/**
 * Reusable utility for handling AsyncStorage caching with TTL
 */
export const cacheHelper = {
    /**
     * Get data from cache, checking for expiration
     */
    async get<T>(key: string, ttl: number): Promise<T | null> {
        try {
            const cachedString = await AsyncStorage.getItem(key);
            if (!cachedString) return null;

            const { data, timestamp }: CacheData<T> = JSON.parse(cachedString);

            // Check if expired
            if (Date.now() - timestamp > ttl) {
                await AsyncStorage.removeItem(key);
                return null;
            }

            return data;
        } catch (error) {
            console.error(`Error reading cache for key ${key}:`, error);
            return null;
        }
    },

    /**
     * Set data to cache with current timestamp
     */
    async set<T>(key: string, data: T): Promise<void> {
        try {
            const cacheData: CacheData<T> = {
                data,
                timestamp: Date.now()
            };
            await AsyncStorage.setItem(key, JSON.stringify(cacheData));
        } catch (error) {
            console.error(`Error setting cache for key ${key}:`, error);
        }
    },

    /**
     * Remove specific key or clear entire cache
     */
    async remove(key: string): Promise<void> {
        await AsyncStorage.removeItem(key);
    },

    /**
     * Get item directly without TTL logic (for simple storage)
     */
    async getRaw(key: string): Promise<string | null> {
        return await AsyncStorage.getItem(key);
    },

    /**
     * Set item directly without TTL logic
     */
    async setRaw(key: string, value: string): Promise<void> {
        await AsyncStorage.setItem(key, value);
    }
};
