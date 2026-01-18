/**
 * Daily Log Repository
 * Handles CRUD operations for daily work logs.
 * Uses StorageAdapter for persistence abstraction.
 */

import type { DailyLog, DailyLogRepository } from '../domain/types';
import { storageAdapter } from './storageAdapter';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'daily_logs';

class LocalDailyLogRepository implements DailyLogRepository {
    private async getAllLogs(): Promise<DailyLog[]> {
        const logs = await storageAdapter.get<DailyLog[]>(STORAGE_KEY);
        return logs || [];
    }

    private async saveLogs(logs: DailyLog[]): Promise<void> {
        await storageAdapter.set(STORAGE_KEY, logs);
    }

    async getAll(): Promise<DailyLog[]> {
        const logs = await this.getAllLogs();
        return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    async getById(id: string): Promise<DailyLog | null> {
        const logs = await this.getAllLogs();
        return logs.find(log => log.id === id) || null;
    }

    async getByDate(date: string): Promise<DailyLog | null> {
        const logs = await this.getAllLogs();
        return logs.find(log => log.date === date) || null;
    }

    async getByDateRange(startDate: string, endDate: string): Promise<DailyLog[]> {
        const logs = await this.getAllLogs();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        return logs
            .filter(log => {
                const logDate = new Date(log.date).getTime();
                return logDate >= start && logDate <= end;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    async save(log: Partial<DailyLog> & { date: string; workDescription: string }): Promise<DailyLog> {
        const logs = await this.getAllLogs();
        const now = new Date().toISOString();

        // Check if log exists for this date (update) or is new (create)
        const existingIndex = log.id
            ? logs.findIndex(l => l.id === log.id)
            : logs.findIndex(l => l.date === log.date);

        const savedLog: DailyLog = {
            id: log.id || uuidv4(),
            date: log.date,
            workDescription: log.workDescription,
            impact: log.impact,
            links: log.links || [],
            blockers: log.blockers,
            createdAt: existingIndex >= 0 ? logs[existingIndex].createdAt : now,
            updatedAt: now,
        };

        if (existingIndex >= 0) {
            logs[existingIndex] = savedLog;
        } else {
            logs.push(savedLog);
        }

        await this.saveLogs(logs);
        return savedLog;
    }

    async delete(id: string): Promise<void> {
        const logs = await this.getAllLogs();
        const filteredLogs = logs.filter(log => log.id !== id);
        await this.saveLogs(filteredLogs);
    }
}

// Export singleton instance
export const dailyLogRepository = new LocalDailyLogRepository();
