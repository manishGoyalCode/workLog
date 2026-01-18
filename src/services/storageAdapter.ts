/**
 * Local Storage Adapter
 * Implements StorageAdapter interface using browser localStorage.
 * Can be replaced with API calls for backend integration.
 */

import type { StorageAdapter } from '../domain/types';

const STORAGE_PREFIX = 'impactlog_';

class LocalStorageAdapter implements StorageAdapter {
    async get<T>(key: string): Promise<T | null> {
        try {
            const item = localStorage.getItem(STORAGE_PREFIX + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    async set<T>(key: string, value: T): Promise<void> {
        try {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            throw error;
        }
    }

    async remove(key: string): Promise<void> {
        try {
            localStorage.removeItem(STORAGE_PREFIX + key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            throw error;
        }
    }

    async clear(): Promise<void> {
        try {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith(STORAGE_PREFIX)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const storageAdapter = new LocalStorageAdapter();
